package com.coursework.calendar.config;

import org.springframework.core.Ordered;
import org.springframework.core.annotation.Order;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;

@Controller
@Order(Ordered.LOWEST_PRECEDENCE)
public class SpaController {

    /**
     * Обработка всех не-API запросов для SPA
     * Все запросы, которые не начинаются с /api и не являются статическими
     * ресурсами, перенаправляются на index.html
     * Используется LOWEST_PRECEDENCE, чтобы этот контроллер обрабатывал запросы в
     * последнюю очередь
     */
    @RequestMapping(value = {
            "/",
            "/login",
            "/register",
            "/profile",
            "/events",
            "/events/**",
            "/invitations",
            "/contacts",
            "/admin/**"
    })
    public String index() {
        return "forward:/index.html";
    }
}
