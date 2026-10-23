package com.shiguang.web;

import com.shiguang.dto.BootstrapDto;
import com.shiguang.service.AuthService;
import com.shiguang.service.BootstrapService;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1")
public class BootstrapController {
    private final BootstrapService bootstrapService;
    private final AuthService authService;

    public BootstrapController(BootstrapService bootstrapService, AuthService authService) {
        this.bootstrapService = bootstrapService;
        this.authService = authService;
    }

    @GetMapping("/bootstrap")
    public BootstrapDto bootstrap() {
        return bootstrapService.load(authService.currentPrincipal());
    }
}
