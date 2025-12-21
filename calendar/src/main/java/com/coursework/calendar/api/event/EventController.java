package com.coursework.calendar.api.event;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collector;
import java.util.stream.Collectors;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

import jakarta.validation.Valid;

import com.coursework.calendar.api.event.dto.EventRequest;
import com.coursework.calendar.api.event.dto.EventResponse;
import com.coursework.calendar.mapper.EventMapper;
import com.coursework.calendar.service.EventService;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;

@RestController
@RequestMapping("/api/events")
@Tag(name = "События", description = "API для управления событиями календаря")
public class EventController {
    private final EventService eventService;

    public EventController(EventService eventService) {
        this.eventService = eventService;
    }

    @GetMapping
    @Operation(summary = "Получить все события", description = "Возвращает список всех событий")
    @ApiResponse(responseCode = "200", description = "Успешное получение списка событий", content = @Content(schema = @Schema(implementation = EventResponse.class)))
    public List<EventResponse> getAllEvents() {
        return eventService.getAllEvents().stream()
                .map(EventMapper::toResponse)
                .collect(Collectors.toList());
    }

    @GetMapping("/user/{userId}")
    @Operation(summary = "Получить все события пользователя", description = "Возвращает список всех событий пользователя")
    @ApiResponse(responseCode = "200", description = "Успешное получение списка событий пользователя", content = @Content(schema = @Schema(implementation = EventResponse.class)))
    public List<EventResponse> getUserEvents(@PathVariable UUID userId) {
        return eventService.getEventsByUserId(userId).stream()
                .map(EventMapper::toResponse)
                .collect(Collectors.toList());
    }

    @GetMapping("/{id}")
    @Operation(summary = "Получить событие по ID", description = "Возвращает событие по указанному идентификатору")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Событие найдено", content = @Content(schema = @Schema(implementation = EventResponse.class))),
            @ApiResponse(responseCode = "404", description = "Событие не найдено")
    })
    public EventResponse getEventById(
            @Parameter(description = "Идентификатор события", required = true) @PathVariable UUID id) {
        return EventMapper.toResponse(eventService.getEventById(id));
    }

    @PostMapping
    @Operation(summary = "Создать событие", description = "Создает новое событие в календаре")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "201", description = "Событие успешно создано", content = @Content(schema = @Schema(implementation = EventResponse.class))),
            @ApiResponse(responseCode = "400", description = "Некорректные данные запроса")
    })
    @ResponseStatus(HttpStatus.CREATED)
    public EventResponse createEvent(
            @Parameter(description = "Данные события", required = true) @Valid @RequestBody EventRequest eventRequest) {
        return EventMapper.toResponse(eventService.createEvent(EventMapper.toEntity(eventRequest)));
    }

    @PutMapping("/{id}")
    @Operation(summary = "Обновить событие", description = "Обновляет существующее событие")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Событие успешно обновлено", content = @Content(schema = @Schema(implementation = EventResponse.class))),
            @ApiResponse(responseCode = "404", description = "Событие не найдено"),
            @ApiResponse(responseCode = "400", description = "Некорректные данные запроса")
    })
    public EventResponse updateEvent(
            @Parameter(description = "Идентификатор события", required = true) @PathVariable UUID id,
            @Parameter(description = "Обновленные данные события", required = true) @Valid @RequestBody EventRequest eventRequest) {
        return EventMapper.toResponse(eventService.updateEvent(id, EventMapper.toEntity(eventRequest)));
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Удалить событие", description = "Удаляет событие по указанному идентификатору")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "204", description = "Событие успешно удалено"),
            @ApiResponse(responseCode = "404", description = "Событие не найдено")
    })
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void deleteEvent(
            @Parameter(description = "Идентификатор события", required = true) @PathVariable UUID id) {
        eventService.deleteEvent(id);
    }
}
