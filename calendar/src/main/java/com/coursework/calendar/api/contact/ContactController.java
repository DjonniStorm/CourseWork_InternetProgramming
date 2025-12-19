package com.coursework.calendar.api.contact;

import java.util.List;
import java.util.UUID;
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

import com.coursework.calendar.api.contact.dto.ContactRequestResponse;
import com.coursework.calendar.api.contact.dto.ContactRequestRs;
import com.coursework.calendar.mapper.ContactMapper;
import com.coursework.calendar.service.ContactService;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;

@RestController
@RequestMapping("/api/contacts")
@Tag(name = "Контакты", description = "API для управления запросами на добавление в контакты")
public class ContactController {
    private final ContactService contactService;

    public ContactController(ContactService contactService) {
        this.contactService = contactService;
    }

    @GetMapping
    @Operation(summary = "Получить все запросы на контакты", description = "Возвращает список всех запросов на добавление в контакты")
    @ApiResponse(responseCode = "200", description = "Успешное получение списка запросов",
            content = @Content(schema = @Schema(implementation = ContactRequestResponse.class)))
    public List<ContactRequestResponse> getAllContactRequests() {
        return contactService.getAllContactRequests().stream()
                .map(ContactMapper::toResponse)
                .collect(Collectors.toList());
    }

    @GetMapping("/{id}")
    @Operation(summary = "Получить запрос на контакт по ID", description = "Возвращает запрос на добавление в контакты по указанному идентификатору")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Запрос найден",
                    content = @Content(schema = @Schema(implementation = ContactRequestResponse.class))),
            @ApiResponse(responseCode = "404", description = "Запрос не найден")
    })
    public ContactRequestResponse getContactRequestById(
            @Parameter(description = "Идентификатор запроса", required = true) @PathVariable UUID id) {
        return ContactMapper.toResponse(contactService.getContactRequestById(id));
    }

    @GetMapping("/user/{userId}")
    @Operation(summary = "Получить запросы на контакты пользователя", description = "Возвращает все запросы на добавление в контакты для указанного пользователя")
    @ApiResponse(responseCode = "200", description = "Успешное получение запросов пользователя",
            content = @Content(schema = @Schema(implementation = ContactRequestResponse.class)))
    public List<ContactRequestResponse> getContactRequestsByUserId(
            @Parameter(description = "Идентификатор пользователя", required = true) @PathVariable UUID userId) {
        return contactService.getContactRequestsByUserId(userId).stream()
                .map(ContactMapper::toResponse)
                .collect(Collectors.toList());
    }

    @PostMapping
    @Operation(summary = "Создать запрос на контакт", description = "Создает новый запрос на добавление в контакты")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "201", description = "Запрос успешно создан",
                    content = @Content(schema = @Schema(implementation = ContactRequestResponse.class))),
            @ApiResponse(responseCode = "400", description = "Некорректные данные запроса")
    })
    @ResponseStatus(HttpStatus.CREATED)
    public ContactRequestResponse createContactRequest(
            @Parameter(description = "Данные запроса на контакт", required = true) @RequestBody ContactRequestRs contactRequestRs) {
        return ContactMapper.toResponse(contactService.createContactRequest(ContactMapper.toEntity(contactRequestRs)));
    }

    @PutMapping("/{id}")
    @Operation(summary = "Обновить запрос на контакт", description = "Обновляет существующий запрос на добавление в контакты")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Запрос успешно обновлен",
                    content = @Content(schema = @Schema(implementation = ContactRequestResponse.class))),
            @ApiResponse(responseCode = "404", description = "Запрос не найден"),
            @ApiResponse(responseCode = "400", description = "Некорректные данные запроса")
    })
    public ContactRequestResponse updateContactRequest(
            @Parameter(description = "Идентификатор запроса", required = true) @PathVariable UUID id,
            @Parameter(description = "Обновленные данные запроса", required = true) @RequestBody ContactRequestRs contactRequestRs) {
        return ContactMapper
                .toResponse(contactService.updateContactRequest(id, ContactMapper.toEntity(contactRequestRs)));
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Удалить запрос на контакт", description = "Удаляет запрос на добавление в контакты по указанному идентификатору")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "204", description = "Запрос успешно удален"),
            @ApiResponse(responseCode = "404", description = "Запрос не найден")
    })
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void deleteContactRequest(
            @Parameter(description = "Идентификатор запроса", required = true) @PathVariable UUID id) {
        contactService.deleteContactRequest(id);
    }
}
