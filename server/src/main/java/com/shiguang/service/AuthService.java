package com.shiguang.service;

import com.shiguang.common.ApiException;
import com.shiguang.domain.User;
import com.shiguang.dto.LoginRequest;
import com.shiguang.dto.MeResponse;
import com.shiguang.dto.RegisterRequest;
import com.shiguang.dto.UserDto;
import com.shiguang.mapper.UserMapper;
import com.shiguang.security.UserPrincipal;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.servlet.http.HttpSession;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.core.context.SecurityContext;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.context.SecurityContextRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.concurrent.ThreadLocalRandom;

@Service
public class AuthService {
    private static final List<String> AVATAR_COLORS = List.of("#B36A3C", "#456985", "#A85A7B", "#64744E", "#8C6239");

    private final UserMapper userMapper;
    private final PasswordEncoder passwordEncoder;
    private final AuthenticationManager authenticationManager;
    private final SecurityContextRepository securityContextRepository;

    public AuthService(UserMapper userMapper,
                       PasswordEncoder passwordEncoder,
                       AuthenticationManager authenticationManager,
                       SecurityContextRepository securityContextRepository) {
        this.userMapper = userMapper;
        this.passwordEncoder = passwordEncoder;
        this.authenticationManager = authenticationManager;
        this.securityContextRepository = securityContextRepository;
    }

    @Transactional
    public UserDto register(RegisterRequest request, HttpServletRequest httpRequest, HttpServletResponse httpResponse) {
        String email = request.email().trim().toLowerCase();
        if (!request.password().equals(request.confirm())) {
            throw ApiException.badRequest("两次输入的密码不一致。");
        }
        if (userMapper.findByEmail(email) != null) {
            throw ApiException.conflict("这个邮箱已经注册过了，直接登录吧。");
        }

        User user = new User();
        user.setName(request.name().trim());
        user.setEmail(email);
        user.setPasswordHash(passwordEncoder.encode(request.password()));
        user.setBio("刚刚在食光开了一间小厨房。");
        user.setAvatarColor(AVATAR_COLORS.get(ThreadLocalRandom.current().nextInt(AVATAR_COLORS.size())));
        user.setVerified(false);
        user.setCreatedAt(LocalDateTime.now());
        userMapper.insert(user);

        UserPrincipal principal = UserPrincipal.from(user);
        establishSession(principal, httpRequest, httpResponse);
        return toDto(user);
    }

    public UserDto login(LoginRequest request, HttpServletRequest httpRequest, HttpServletResponse httpResponse) {
        try {
            Authentication authentication = authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(request.email().trim().toLowerCase(), request.password()));
            UserPrincipal principal = (UserPrincipal) authentication.getPrincipal();
            establishSession(principal, httpRequest, httpResponse);
            return toDto(requireUserEntity(principal.id()));
        } catch (AuthenticationException ex) {
            throw ApiException.unauthorized("邮箱或密码不正确。");
        }
    }

    public MeResponse me() {
        UserPrincipal principal = currentPrincipal();
        if (principal == null) {
            return MeResponse.guest();
        }
        User user = userMapper.selectById(principal.id());
        if (user == null) {
            return MeResponse.guest();
        }
        return MeResponse.of(toDto(user));
    }

    public void logout(HttpServletRequest request) {
        SecurityContextHolder.clearContext();
        HttpSession session = request.getSession(false);
        if (session != null) {
            session.invalidate();
        }
    }

    public UserPrincipal currentPrincipal() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication != null && authentication.isAuthenticated()
                && authentication.getPrincipal() instanceof UserPrincipal principal) {
            return principal;
        }
        return null;
    }

    public UserPrincipal requirePrincipal() {
        UserPrincipal principal = currentPrincipal();
        if (principal == null) {
            throw ApiException.unauthorized("请先登录。");
        }
        return principal;
    }

    public User requireUserEntity(Long id) {
        User user = userMapper.selectById(id);
        if (user == null) {
            throw ApiException.unauthorized("登录状态已失效，请重新登录。");
        }
        return user;
    }

    public UserDto toDto(User user) {
        return new UserDto(
                user.getId(),
                user.getName(),
                user.getEmail(),
                user.getBio(),
                user.getAvatarColor(),
                user.getAvatarUrl(),
                Boolean.TRUE.equals(user.getVerified()),
                user.getCreatedAt()
        );
    }

    private void establishSession(UserPrincipal principal,
                                  HttpServletRequest request,
                                  HttpServletResponse response) {
        if (request.getSession(false) != null) {
            request.changeSessionId();
        }
        SecurityContext context = SecurityContextHolder.createEmptyContext();
        context.setAuthentication(new UsernamePasswordAuthenticationToken(principal, null, principal.getAuthorities()));
        SecurityContextHolder.setContext(context);
        securityContextRepository.saveContext(context, request, response);
    }
}
