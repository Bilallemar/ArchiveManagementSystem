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

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.time.LocalDate;
import java.util.Arrays;

@Configuration
@EnableWebSecurity
@EnableMethodSecurity(prePostEnabled = true, securedEnabled = true, jsr250Enabled = true)
public class SecurityConfig {

    private static final Logger logger = LoggerFactory.getLogger(SecurityConfig.class);

    @Autowired
    private AuthEntryPointJwt unauthorizedHandler;

    @Autowired
    @Lazy
    private OAuth2LoginSuccessHandler oAuth2LoginSuccessHandler;

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
                 .requestMatchers("/", "/health", "/error").permitAll()
                 .requestMatchers("/favicon.*").permitAll()

                .requestMatchers("/api/auth/public/**").permitAll()
                .requestMatchers("/oauth2/**").permitAll()
                .requestMatchers("/api/csrf-token").permitAll()
                .requestMatchers("/uploads/**").permitAll()
                .requestMatchers("/api/admin/**").hasRole("ADMIN")
                .requestMatchers("/api/user-management/**").hasRole("ADMIN")
                .anyRequest().authenticated()
            )
            .oauth2Login(oauth2 -> oauth2.successHandler(oAuth2LoginSuccessHandler))
            .addFilterBefore(authTokenFilter, UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }

@Bean
public CorsConfigurationSource corsConfigurationSource() {
    CorsConfiguration config = new CorsConfiguration();
    
    config.setAllowedOriginPatterns(Arrays.asList(
        "http://localhost:*",      // ✅ Allows any localhost port
        "http://127.0.0.1:*"       // ✅ Allows any 127.0.0.1 port
    ));
    
    config.setAllowedMethods(Arrays.asList("GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"));
    config.setAllowedHeaders(Arrays.asList("*"));
    config.setExposedHeaders(Arrays.asList("Authorization"));
    config.setAllowCredentials(true);  // ✅ Works with patterns
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
            logger.info("Starting database initialization...");
            
            // Create managements
            Management archiveManagement = createManagementIfNotExists(managementRepository, 1L, "Archive");
            Management hifziyaManagement = createManagementIfNotExists(managementRepository, 2L, "Hifziya");
            Management makhzanManagement = createManagementIfNotExists(managementRepository, 3L, "Makhzan");
            
            logger.info("Managements initialized: Archive, Hifziya, Makhzan");
            
            // Create roles
            Role userRole = roleRepository.findByRoleName(AppRole.ROLE_USER)
                    .orElseGet(() -> roleRepository.save(new Role(AppRole.ROLE_USER)));
            
            Role adminRole = roleRepository.findByRoleName(AppRole.ROLE_ADMIN)
                    .orElseGet(() -> roleRepository.save(new Role(AppRole.ROLE_ADMIN)));
            
            logger.info("Roles initialized: ROLE_USER, ROLE_ADMIN");
            
            // Create or update admin user
            User admin = userRepository.findByUserName("admin")
                    .orElse(new User());
            
            admin.setUserName("admin");
            admin.setEmail("admin@example.com");
            admin.setPassword(passwordEncoder.encode("adminPass"));
            admin.setAccountNonLocked(true);
            admin.setAccountNonExpired(true);
            admin.setCredentialsNonExpired(true);
            admin.setEnabled(true);
            admin.setCredentialsExpiryDate(LocalDate.now().plusYears(1));
            admin.setAccountExpiryDate(LocalDate.now().plusYears(1));
            admin.setTwoFactorEnabled(false);
            admin.setSignUpMethod("email");
            admin.setRole(adminRole);
            admin.setManagement(archiveManagement);
            
            userRepository.save(admin);
            logger.info("Admin user created/updated: username=admin, management=Archive");
            
            // Create test users
            createUserIfNotExists(userRepository, passwordEncoder, "user1", "user1@example.com", 
                                "password1", userRole, null);
            createUserIfNotExists(userRepository, passwordEncoder, "archive_user", "archive@test.com", 
                                "password123", userRole, archiveManagement);
            createUserIfNotExists(userRepository, passwordEncoder, "tashkeel_user", "tashkeel@test.com", 
                                "password123", userRole, hifziyaManagement);
            createUserIfNotExists(userRepository, passwordEncoder, "makhzan_user", "makhzan@test.com", 
                                "password123", userRole, makhzanManagement);
            
            logger.info("Database initialization complete!");
            logger.info("Default credentials - Username: admin, Password: adminPass");
        };
    }
    
    private Management createManagementIfNotExists(ManagementRepository repository, Long id, String name) {
        return repository.findById(id).orElseGet(() -> {
            Management m = new Management();
            m.setManagementName(name);
            return repository.save(m);
        });
    }
    
    private void createUserIfNotExists(UserRepository userRepository, PasswordEncoder passwordEncoder,
                                      String username, String email, String password,
                                      Role role, Management management) {
        if (!userRepository.existsByUserName(username)) {
            User user = new User(username, email, passwordEncoder.encode(password));
            user.setAccountNonLocked(true);
            user.setAccountNonExpired(true);
            user.setCredentialsNonExpired(true);
            user.setEnabled(true);
            user.setCredentialsExpiryDate(LocalDate.now().plusYears(1));
            user.setAccountExpiryDate(LocalDate.now().plusYears(1));
            user.setTwoFactorEnabled(false);
            user.setSignUpMethod("email");
            user.setRole(role);
            user.setManagement(management);
            userRepository.save(user);
            
            String mgmt = management != null ? management.getManagementName() : "none";
            logger.info("Created user: {} (management: {})", username, mgmt);
        }
    }
}