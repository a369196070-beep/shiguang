package com.shiguang.web;

import com.shiguang.dto.UploadResult;
import com.shiguang.service.AuthService;
import com.shiguang.service.UploadService;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequestMapping("/api/v1/uploads")
public class UploadController {
    private final UploadService uploadService;
    private final AuthService authService;

    public UploadController(UploadService uploadService, AuthService authService) {
        this.uploadService = uploadService;
        this.authService = authService;
    }

    @PostMapping("/image")
    public UploadResult image(@RequestParam("file") MultipartFile file) {
        authService.requirePrincipal();
        return uploadService.store(file);
    }
}
