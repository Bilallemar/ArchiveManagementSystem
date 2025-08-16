package com.MCIT.ArchiveManagementSystem.security;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class WebConfig implements WebMvcConfigurer {

    @Value("${frontend.url}")
    private String frontendUrl;

    @Bean
    public WebMvcConfigurer corsConfigurer() {
        return new WebMvcConfigurer() {
            @Override
            public void addCorsMappings(CorsRegistry registry) {
                registry.addMapping("/**")
                        .allowedOrigins(frontendUrl)
                        .allowedMethods("GET", "POST", "PUT", "DELETE", "OPTIONS")
                        .allowedHeaders("*")
                        .allowCredentials(true)
                        .maxAge(3600);
            }
        };
    }
}
// package com.MCIT.ArchiveManagementSystem.security;

// import org.springframework.beans.factory.annotation.Value;
// import org.springframework.context.annotation.Configuration;
// import org.springframework.web.servlet.config.annotation.CorsRegistry;
// import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
// import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

// @Configuration
// public class WebConfig implements WebMvcConfigurer {

//     @Value("${frontend.url}")
//     private String frontendUrl;

//     @Override
//     public void addCorsMappings(CorsRegistry registry) {
//         registry.addMapping("/**")
//                 .allowedOrigins(frontendUrl)
//                 .allowedMethods("GET", "POST", "PUT", "DELETE", "OPTIONS")
//                 .allowedHeaders("*")
//                 .allowCredentials(true)
//                 .maxAge(3600);
//     }

//     @Override
//     public void addResourceHandlers(ResourceHandlerRegistry registry) {
//         // Serve uploaded files from local folder
//         registry.addResourceHandler("/uploads/**")
//                 .addResourceLocations("file:///C:/Users/IT/OneDrive/Desktop/MyProject/ArchiveFullStackProject/uploads/");
//     }
// }

// package com.MCIT.ArchiveManagementSystem.security;

// import org.springframework.beans.factory.annotation.Value;
// import org.springframework.context.annotation.Bean;
// import org.springframework.context.annotation.Configuration;
// import org.springframework.web.servlet.config.annotation.CorsRegistry;
// import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

// @Configuration
// public class WebConfig implements WebMvcConfigurer {

//        @Value("${frontend.url}")
//     private String frontendUrl;

//     @Bean
//     public WebMvcConfigurer corsConfigurer() {
//         return new WebMvcConfigurer() {
//             @Override
//             public void addCorsMappings(CorsRegistry registry) {
//                 registry.addMapping("/")
//                         .allowedOrigins(frontendUrl)
//                         .allowedMethods("GET", "POST", "PUT", "DELETE", "OPTIONS")
//                         .allowedHeaders("*")
//                         .allowCredentials(true)
//                         .maxAge(3600);
//                 registry.addMapping("/api/notes/")
//                         .allowedOrigins(frontendUrl)
//                         .allowedMethods("GET", "POST", "PUT", "DELETE", "OPTIONS")
//                         .allowedHeaders("*")
//                         .allowCredentials(true)
//                         .maxAge(3600);
//                 // Additional paths can be configured similarly
//                 registry.addMapping("/api/auth/")
//                         .allowedOrigins(frontendUrl)
//                         .allowedMethods("GET", "POST", "PUT", "DELETE", "OPTIONS")
//                         .allowedHeaders("*")
//                         .allowCredentials(true)
//                         .maxAge(3600);

//              registry.addMapping("/api/receipts/")
//                         .allowedOrigins(frontendUrl)
//                         .allowedMethods("GET", "POST", "PUT", "DELETE", "OPTIONS")
//                         .allowedHeaders("*")
//                         .allowCredentials(true)
//                         .maxAge(3600);

//             }
//         };
//     }
// }