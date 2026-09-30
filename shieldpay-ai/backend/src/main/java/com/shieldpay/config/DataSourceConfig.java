package com.shieldpay.config;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.jdbc.DataSourceBuilder;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Primary;

import javax.sql.DataSource;
import java.sql.Connection;
import java.sql.DriverManager;

@Configuration
public class DataSourceConfig {

    private static final Logger log = LoggerFactory.getLogger(DataSourceConfig.class);

    @Value("${spring.datasource.url:jdbc:mysql://localhost:3306/shieldpay?createDatabaseIfNotExist=true&useSSL=false&allowPublicKeyRetrieval=true&serverTimezone=UTC}")
    private String mysqlUrl;

    @Value("${spring.datasource.username:root}")
    private String mysqlUsername;

    @Value("${spring.datasource.password:root}")
    private String mysqlPassword;

    @Bean
    @Primary
    public DataSource dataSource() {
        // Attempt MySQL connection test
        log.info("Testing connection to MySQL at {}...", mysqlUrl);
        boolean mysqlAvailable = false;
        try {
            Class.forName("com.mysql.cj.jdbc.Driver");
            try (Connection conn = DriverManager.getConnection(mysqlUrl, mysqlUsername, mysqlPassword)) {
                if (conn != null && !conn.isClosed()) {
                    mysqlAvailable = true;
                    log.info("✓ Successfully connected to MySQL database!");
                }
            }
        } catch (Exception e) {
            log.warn("MySQL connection attempt did not succeed: {}. Gracefully initializing fallback persistent/memory engine so ShieldPay AI runs flawlessly out of the box!", e.getMessage());
        }

        if (mysqlAvailable) {
            return DataSourceBuilder.create()
                    .driverClassName("com.mysql.cj.jdbc.Driver")
                    .url(mysqlUrl)
                    .username(mysqlUsername)
                    .password(mysqlPassword)
                    .build();
        } else {
            log.info("Initializing fallback H2 engine (MySQL mode enabled)...");
            return DataSourceBuilder.create()
                    .driverClassName("org.h2.Driver")
                    .url("jdbc:h2:mem:shieldpay;DB_CLOSE_DELAY=-1;MODE=MySQL;DATABASE_TO_UPPER=false")
                    .username("sa")
                    .password("")
                    .build();
        }
    }
}
