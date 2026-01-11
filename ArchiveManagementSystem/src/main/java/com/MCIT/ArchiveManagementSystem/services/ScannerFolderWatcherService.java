package com.MCIT.ArchiveManagementSystem.services;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.beans.factory.annotation.Value;
import jakarta.annotation.PostConstruct;
import jakarta.annotation.PreDestroy;

import java.io.IOException;
import java.nio.file.*;
import java.util.*;
import java.util.concurrent.ConcurrentHashMap;
import java.io.File;

@Service
public class ScannerFolderWatcherService {
    
    private static final Logger logger = LoggerFactory.getLogger(ScannerFolderWatcherService.class);
    
    // Configure this path in application.properties
    @Value("${scanner.folder.path:C:/ScannerOutput}")
    private String scannerFolderPath;
    
    private WatchService watchService;
    private Thread watchThread;
    private volatile boolean running = false;
    
    // Store files detected in the folder (thread-safe)
    private final Map<String, FileInfo> detectedFiles = new ConcurrentHashMap<>();
    
    @PostConstruct
    public void init() {
        startWatching();
    }
    
    @PreDestroy
    public void cleanup() {
        stopWatching();
    }
    
    public void startWatching() {
        try {
            Path path = Paths.get(scannerFolderPath);
            
            // Create folder if it doesn't exist
            if (!Files.exists(path)) {
                Files.createDirectories(path);
                logger.info("Created scanner folder: {}", scannerFolderPath);
            }
            
            // Initialize watch service
            watchService = FileSystems.getDefault().newWatchService();
            path.register(watchService, 
                StandardWatchEventKinds.ENTRY_CREATE,
                StandardWatchEventKinds.ENTRY_MODIFY,
                StandardWatchEventKinds.ENTRY_DELETE);
            
            running = true;
            
            // Load existing files
            loadExistingFiles(path);
            
            // Start watching in a separate thread
            watchThread = new Thread(this::watchFolder);
            watchThread.setDaemon(true);
            watchThread.start();
            
            logger.info("Started watching scanner folder: {}", scannerFolderPath);
            
        } catch (IOException e) {
            logger.error("Failed to start folder watcher", e);
        }
    }
    
    private void loadExistingFiles(Path folderPath) {
        try {
            File folder = folderPath.toFile();
            File[] files = folder.listFiles();
            
            if (files != null) {
                for (File file : files) {
                    if (file.isFile()) {
                        detectedFiles.put(file.getName(), new FileInfo(
                            file.getName(),
                            file.getAbsolutePath(),
                            file.length(),
                            new Date(file.lastModified())
                        ));
                    }
                }
                logger.info("Loaded {} existing files from scanner folder", detectedFiles.size());
            }
        } catch (Exception e) {
            logger.error("Error loading existing files", e);
        }
    }
    
    private void watchFolder() {
        while (running) {
            try {
                WatchKey key = watchService.take();
                
                for (WatchEvent<?> event : key.pollEvents()) {
                    WatchEvent.Kind<?> kind = event.kind();
                    
                    if (kind == StandardWatchEventKinds.OVERFLOW) {
                        continue;
                    }
                    
                    @SuppressWarnings("unchecked")
                    WatchEvent<Path> ev = (WatchEvent<Path>) event;
                    Path filename = ev.context();
                    Path fullPath = Paths.get(scannerFolderPath).resolve(filename);
                    File file = fullPath.toFile();
                    
                    if (kind == StandardWatchEventKinds.ENTRY_CREATE || 
                        kind == StandardWatchEventKinds.ENTRY_MODIFY) {
                        
                        if (file.isFile()) {
                            // Wait a bit to ensure file is completely written
                            Thread.sleep(500);
                            
                            detectedFiles.put(filename.toString(), new FileInfo(
                                filename.toString(),
                                fullPath.toString(),
                                file.length(),
                                new Date(file.lastModified())
                            ));
                            
                            logger.info("File detected: {}", filename);
                        }
                    } else if (kind == StandardWatchEventKinds.ENTRY_DELETE) {
                        detectedFiles.remove(filename.toString());
                        logger.info("File removed: {}", filename);
                    }
                }
                
                key.reset();
                
            } catch (InterruptedException e) {
                logger.info("Folder watcher interrupted");
                Thread.currentThread().interrupt();
                break;
            } catch (Exception e) {
                logger.error("Error in folder watcher", e);
            }
        }
    }
    
    public void stopWatching() {
        running = false;
        if (watchThread != null) {
            watchThread.interrupt();
        }
        if (watchService != null) {
            try {
                watchService.close();
            } catch (IOException e) {
                logger.error("Error closing watch service", e);
            }
        }
        logger.info("Stopped watching scanner folder");
    }
    
    /**
     * Get all files currently in the scanner folder
     */
    public List<FileInfo> getDetectedFiles() {
        return new ArrayList<>(detectedFiles.values());
    }
    
    /**
     * Clear all detected files (useful after processing)
     */
    public void clearDetectedFiles() {
        detectedFiles.clear();
        logger.info("Cleared detected files list");
    }
    
    /**
     * Get and clear files (atomic operation)
     */
    public List<FileInfo> getAndClearFiles() {
        List<FileInfo> files = new ArrayList<>(detectedFiles.values());
        detectedFiles.clear();
        return files;
    }
    
    /**
     * Delete a file from the scanner folder
     */
    public boolean deleteFile(String filename) {
        try {
            Path filePath = Paths.get(scannerFolderPath, filename);
            Files.deleteIfExists(filePath);
            detectedFiles.remove(filename);
            logger.info("Deleted file: {}", filename);
            return true;
        } catch (IOException e) {
            logger.error("Failed to delete file: {}", filename, e);
            return false;
        }
    }
    
    /**
     * Get the scanner folder path
     */
    public String getScannerFolderPath() {
        return scannerFolderPath;
    }
    
    // Inner class to represent file information
    public static class FileInfo {
        private String name;
        private String path;
        private long size;
        private Date lastModified;
        
        public FileInfo(String name, String path, long size, Date lastModified) {
            this.name = name;
            this.path = path;
            this.size = size;
            this.lastModified = lastModified;
        }
        
        // Getters
        public String getName() { return name; }
        public String getPath() { return path; }
        public long getSize() { return size; }
        public Date getLastModified() { return lastModified; }
        
        // Setters
        public void setName(String name) { this.name = name; }
        public void setPath(String path) { this.path = path; }
        public void setSize(long size) { this.size = size; }
        public void setLastModified(Date lastModified) { this.lastModified = lastModified; }
    }
}