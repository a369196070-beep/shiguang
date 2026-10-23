package com.shiguang.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record RegisterRequest(
        @NotBlank(message = "请写下你的名字。")
        @Size(min = 2, max = 20, message = "名字需要 2-20 个字。")
        String name,

        @NotBlank(message = "请输入邮箱。")
        @Email(message = "邮箱格式不正确。")
        @Size(max = 190, message = "邮箱太长了。")
        String email,

        @NotBlank(message = "请设置密码。")
        @Size(min = 6, max = 72, message = "密码需要 6-72 位。")
        String password,

        @NotBlank(message = "请再输入一次密码。")
        String confirm
) {
}
