package com.MCIT.ArchiveManagementSystem.security;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Lazy;
import org.springframework.http.HttpMethod;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import com.MCIT.ArchiveManagementSystem.config.OAuth2LoginSuccessHandler;
import com.MCIT.ArchiveManagementSystem.models.AppRole;
import com.MCIT.ArchiveManagementSystem.models.Management;
import com.MCIT.ArchiveManagementSystem.models.Role;
import com.MCIT.ArchiveManagementSystem.models.User;
import com.MCIT.ArchiveManagementSystem.repositories.ManagementRepository;
import com.MCIT.ArchiveManagementSystem.repositories.RoleRepository;
import com.MCIT.ArchiveManagementSystem.repositories.UserRepository;
import com.MCIT.ArchiveManagementSystem.security.jwt.AuthEntryPointJwt;
import com.MCIT.ArchiveManagementSystem.security.jwt.AuthTokenFilter;

import java.time.LocalDate;
import java.util.Arrays;

@Configuration
@EnableWebSecurity
@EnableMethodSecurity(prePostEnabled = true, securedEnabled = true, jsr250Enabled = true)
public class SecurityConfig {

    @Autowired
    private AuthEntryPointJwt unauthorizedHandler;

    @Autowired
    @Lazy
    private OAuth2LoginSuccessHandler oAuth2LoginSuccessHandler;

    @Autowired
    private ManagementRepository managementRepository;

    @Autowired
    private AuthTokenFilter authTokenFilter;

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
            .cors(cors -> cors.configurationSource(corsConfigurationSource()))
            .csrf(AbstractHttpConfigurer::disable)
            .exceptionHandling(exception -> exception.authenticationEntryPoint(unauthorizedHandler))
            .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
            .authorizeHttpRequests(auth -> auth
                .requestMatchers(HttpMethod.OPTIONS, "/**").permitAll()
                .requestMatchers("/api/auth/public/**").permitAll()
                .requestMatchers("/oauth2/**").permitAll()
                .requestMatchers("/api/csrf-token").permitAll()
                .requestMatchers("/uploads/**").permitAll()
                .requestMatchers("/api/admin/**").hasRole("ADMIN")
                .requestMatchers("/api/user-management/**").hasRole("ADMIN")
                .requestMatchers("/api/archives/**").authenticated()
                .requestMatchers("/api/sawanih/**").authenticated()
                .requestMatchers("/api/hifziya-hazari/**").authenticated()
                .requestMatchers("/api/hifziya-warada-sadera/**").authenticated()
                .requestMatchers("/api/makzan-receipts/**").authenticated()
                .requestMatchers("/api/makzan-annual-reports/**").authenticated()
                .requestMatchers("/api/annual-reports-info/**").authenticated()
                .requestMatchers("/api/managements/**").authenticated()
                .requestMatchers("/api/receipts/**").authenticated()
                .requestMatchers("/api/receipts/download/**").authenticated()
                .requestMatchers("/api/files/**").authenticated()
                .requestMatchers("/api/received-issued-books/**").authenticated()
                .requestMatchers("/api/received-issued-books/download/**").authenticated()
                .requestMatchers("/importDoc/**").authenticated()
                .requestMatchers("/exportDoc/**").authenticated()
                .requestMatchers("/annual-reports/**").authenticated()
                .requestMatchers("/annual-reports_info/**").authenticated()
                .requestMatchers("/api/attendanceBook/**").authenticated()
                .requestMatchers("/api/fileOffices/**").authenticated()
                .requestMatchers("/api/received-issued-books-repository/**").authenticated()
                .requestMatchers("/api/type/**").authenticated()
                .requestMatchers("/api/sub-type/**").authenticated()
                .requestMatchers("/api/org/**").authenticated()
                .anyRequest().authenticated()
            )
            .oauth2Login(oauth2 -> oauth2.successHandler(oAuth2LoginSuccessHandler))
            .addFilterBefore(authTokenFilter, UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration config = new CorsConfiguration();
        
        // Allow all origins with credentials
        config.setAllowedOriginPatterns(Arrays.asList("*"));
        
        config.setAllowedMethods(Arrays.asList("GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"));
        config.setAllowedHeaders(Arrays.asList("Authorization", "Content-Type", "X-XSRF-TOKEN", "X-Requested-With", "Accept", "Origin"));
        config.setExposedHeaders(Arrays.asList("Authorization", "Access-Control-Allow-Origin"));
        config.setAllowCredentials(true);
        config.setMaxAge(3600L);

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", config);
        return source;
    }

    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration config) throws Exception {
        return config.getAuthenticationManager();
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

@Bean
public CommandLineRunner initData(RoleRepository roleRepository,
                                  UserRepository userRepository,
                                  PasswordEncoder passwordEncoder,
                                  ManagementRepository managementRepository) {
    return args -> {
        // ============================================
        // 1. CREATE ALL 3 MANAGEMENTS
        // ============================================
        Management archiveManagement = managementRepository.findById(1L)
                .orElseGet(() -> {
                    Management m = new Management();
                    m.setManagementName("Archive");
                    return managementRepository.save(m);
                });
        
        Management hifziyaManagement = managementRepository.findById(2L)
                .orElseGet(() -> {
                    Management m = new Management();
                    m.setManagementName("Hifziya");
                    return managementRepository.save(m);
                });
        
        Management makhzanManagement = managementRepository.findById(3L)
                .orElseGet(() -> {
                    Management m = new Management();
                    m.setManagementName("Makhzan");
                    return managementRepository.save(m);
                });
        
        System.out.println("✅ Managements created:");
        System.out.println("   1. Archive (ID: " + archiveManagement.getManagementId() + ")");
        System.out.println("   2. Hifziya (ID: " + hifziyaManagement.getManagementId() + ")");
        System.out.println("   3. Makhzan (ID: " + makhzanManagement.getManagementId() + ")");
        
        // ============================================
        // 2. CREATE ROLES
        // ============================================
        Role userRole = roleRepository.findByRoleName(AppRole.ROLE_USER)
                .orElseGet(() -> roleRepository.save(new Role(AppRole.ROLE_USER)));
        
        Role adminRole = roleRepository.findByRoleName(AppRole.ROLE_ADMIN)
                .orElseGet(() -> roleRepository.save(new Role(AppRole.ROLE_ADMIN)));
        
        System.out.println("✅ Roles created");
        
        // ============================================
        // 3. CREATE DEFAULT USERS WITH CORRECT MANAGEMENT
        // ============================================
        
        // Create user1 - no management initially
        if (!userRepository.existsByUserName("user1")) {
            User user1 = new User("user1", "user1@example.com",
                    passwordEncoder.encode("password1"));
            user1.setAccountNonLocked(true);
            user1.setAccountNonExpired(true);
            user1.setCredentialsNonExpired(true);
            user1.setEnabled(true);
            user1.setCredentialsExpiryDate(LocalDate.now().plusYears(1));
            user1.setAccountExpiryDate(LocalDate.now().plusYears(1));
            user1.setTwoFactorEnabled(false);
            user1.setSignUpMethod("email");
            user1.setRole(userRole);
            userRepository.save(user1);
            System.out.println("✅ Created user: user1 (no management)");
        }
        
        // Create admin - Archive management (ID: 1)
        if (!userRepository.existsByUserName("admin")) {
            User admin = new User("admin", "admin@example.com",
                    passwordEncoder.encode("adminPass"));
            admin.setAccountNonLocked(true);
            admin.setAccountNonExpired(true);
            admin.setCredentialsNonExpired(true);
            admin.setEnabled(true);
            admin.setCredentialsExpiryDate(LocalDate.now().plusYears(1));
            admin.setAccountExpiryDate(LocalDate.now().plusYears(1));
            admin.setTwoFactorEnabled(false);
            admin.setSignUpMethod("email");
            admin.setRole(adminRole);
            admin.setManagement(archiveManagement); // Admin → Archive
            userRepository.save(admin);
            System.out.println("✅ Created admin: admin (Archive management)");
        }
        
        // Create archive_user - Archive management (ID: 1)
        if (!userRepository.existsByUserName("archive_user")) {
            User archiveUser = new User("archive_user", "archive@test.com",
                    passwordEncoder.encode("password123"));
            archiveUser.setAccountNonLocked(true);
            archiveUser.setAccountNonExpired(true);
            archiveUser.setCredentialsNonExpired(true);
            archiveUser.setEnabled(true);
            archiveUser.setCredentialsExpiryDate(LocalDate.now().plusYears(1));
            archiveUser.setAccountExpiryDate(LocalDate.now().plusYears(1));
            archiveUser.setTwoFactorEnabled(false);
            archiveUser.setSignUpMethod("email");
            archiveUser.setRole(userRole);
            archiveUser.setManagement(archiveManagement);
            userRepository.save(archiveUser);
            System.out.println("✅ Created user: archive_user (Archive management)");
        }
        
        // Create tashkeel_user - Hifziya management (ID: 2)
        if (!userRepository.existsByUserName("tashkeel_user")) {
            User tashkeelUser = new User("tashkeel_user", "tashkeel@test.com",
                    passwordEncoder.encode("password123"));
            tashkeelUser.setAccountNonLocked(true);
            tashkeelUser.setAccountNonExpired(true);
            tashkeelUser.setCredentialsNonExpired(true);
            tashkeelUser.setEnabled(true);
            tashkeelUser.setCredentialsExpiryDate(LocalDate.now().plusYears(1));
            tashkeelUser.setAccountExpiryDate(LocalDate.now().plusYears(1));
            tashkeelUser.setTwoFactorEnabled(false);
            tashkeelUser.setSignUpMethod("email");
            tashkeelUser.setRole(userRole);
            tashkeelUser.setManagement(hifziyaManagement); // Hifziya
            userRepository.save(tashkeelUser);
            System.out.println("✅ Created user: tashkeel_user (Hifziya management)");
        }
        
        // Create makhzan_user - Makhzan management (ID: 3)
        if (!userRepository.existsByUserName("makhzan_user")) {
            User makhzanUser = new User("makhzan_user", "makhzan@test.com",
                    passwordEncoder.encode("password123"));
            makhzanUser.setAccountNonLocked(true);
            makhzanUser.setAccountNonExpired(true);
            makhzanUser.setCredentialsNonExpired(true);
            makhzanUser.setEnabled(true);
            makhzanUser.setCredentialsExpiryDate(LocalDate.now().plusYears(1));
            makhzanUser.setAccountExpiryDate(LocalDate.now().plusYears(1));
            makhzanUser.setTwoFactorEnabled(false);
            makhzanUser.setSignUpMethod("email");
            makhzanUser.setRole(userRole);
            makhzanUser.setManagement(makhzanManagement); // Makhzan
            userRepository.save(makhzanUser);
            System.out.println("✅ Created user: makhzan_user (Makhzan management)");
        }
        
        System.out.println("✅✅✅ Database initialization complete!");
    };
}
}
