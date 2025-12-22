package com.coursework.calendar.config;

import java.io.IOException;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.context.annotation.Profile;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

/**
 * Фильтр для профиля nopass, который автоматически подставляет дефолтного
 * администратора
 * в SecurityContext для всех запросов.
 * Дефолтный администратор: admin@system.local
 */
@Component
@Profile("nopass")
public class NoPassAuthenticationFilter extends OncePerRequestFilter {

    private static final Logger logger = LoggerFactory.getLogger(NoPassAuthenticationFilter.class);
    private static final String DEFAULT_ADMIN_EMAIL = "admin@system.local";

    private final UserDetailsService userDetailsService;

    public NoPassAuthenticationFilter(UserDetailsService userDetailsService) {
        this.userDetailsService = userDetailsService;
    }

    @Override
    protected void doFilterInternal(
            HttpServletRequest request,
            HttpServletResponse response,
            FilterChain filterChain) throws ServletException, IOException {

        // Пропускаем только login и logout без подстановки админа
        // register будет заблокирован в контроллере
        // /me и /refresh будут работать с дефолтным админом
        String path = request.getRequestURI();
        if (path.equals("/api/auth/login") || path.equals("/api/auth/logout")) {
            filterChain.doFilter(request, response);
            return;
        }

        // Если уже есть аутентификация, пропускаем
        if (SecurityContextHolder.getContext().getAuthentication() != null) {
            filterChain.doFilter(request, response);
            return;
        }

        try {
            // Загружаем дефолтного администратора
            UserDetails userDetails = userDetailsService.loadUserByUsername(DEFAULT_ADMIN_EMAIL);

            // Создаем токен аутентификации
            UsernamePasswordAuthenticationToken authToken = new UsernamePasswordAuthenticationToken(
                    userDetails,
                    null,
                    userDetails.getAuthorities());
            authToken.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));

            // Устанавливаем аутентификацию в SecurityContext
            SecurityContextHolder.getContext().setAuthentication(authToken);

            logger.debug("Auto-authenticated as default admin: {}", DEFAULT_ADMIN_EMAIL);
        } catch (UsernameNotFoundException e) {
            logger.warn(
                    "Default admin user ({}) not found. Make sure migration 002-default-admin.xml has been executed. Requests may fail if authentication is required.",
                    DEFAULT_ADMIN_EMAIL);
            // Продолжаем выполнение даже если пользователь не найден
            // Это позволит запросам пройти, но они могут упасть на уровне контроллеров
        } catch (Exception e) {
            logger.error("Unexpected error while loading default admin user ({}): {}",
                    DEFAULT_ADMIN_EMAIL, e.getMessage(), e);
            // Продолжаем выполнение даже при ошибке
        }

        filterChain.doFilter(request, response);
    }
}
