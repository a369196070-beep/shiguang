package com.shiguang.security;

import com.shiguang.domain.User;
import com.shiguang.mapper.UserMapper;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

@Service
public class CustomUserDetailsService implements UserDetailsService {
    private final UserMapper userMapper;

    public CustomUserDetailsService(UserMapper userMapper) {
        this.userMapper = userMapper;
    }

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        User user = userMapper.findByEmail(username == null ? "" : username.trim().toLowerCase());
        if (user == null) {
            throw new UsernameNotFoundException("用户不存在");
        }
        return UserPrincipal.from(user);
    }
}
