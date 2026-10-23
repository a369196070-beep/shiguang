package com.shiguang.service;

import com.shiguang.common.ApiException;
import com.shiguang.config.AppProperties;
import com.shiguang.dto.UploadResult;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import javax.imageio.ImageIO;
import java.awt.image.BufferedImage;
import java.io.ByteArrayInputStream;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.StandardCopyOption;
import java.util.Map;
import java.util.UUID;

@Service
public class UploadService {
    private static final long MAX_BYTES = 10L * 1024 * 1024;
    private static final Map<String, String> EXTENSIONS = Map.of(
            "image/jpeg", ".jpg",
            "image/png", ".png",
            "image/webp", ".webp"
    );

    private final AppProperties properties;

    public UploadService(AppProperties properties) {
        this.properties = properties;
    }

    public UploadResult store(MultipartFile file) {
        if (file == null || file.isEmpty()) {
            throw ApiException.badRequest("请选择一张图片。");
        }
        if (file.getSize() > MAX_BYTES) {
            throw new ApiException(413, "图片不能超过 10MB。");
        }

        String contentType = file.getContentType() == null ? "" : file.getContentType().toLowerCase();
        String extension = EXTENSIONS.get(contentType);
        if (extension == null) {
            throw ApiException.badRequest("只支持 JPG、PNG 或 WebP 图片。");
        }

        try {
            byte[] bytes = file.getBytes();
            if (contentType.equals("image/webp")) {
                if (bytes.length < 12
                        || bytes[0] != 'R' || bytes[1] != 'I' || bytes[2] != 'F' || bytes[3] != 'F'
                        || bytes[8] != 'W' || bytes[9] != 'E' || bytes[10] != 'B' || bytes[11] != 'P') {
                    throw ApiException.badRequest("这个文件不是有效的图片。");
                }
            } else {
                BufferedImage image = ImageIO.read(new ByteArrayInputStream(bytes));
                if (image == null || image.getWidth() < 1 || image.getHeight() < 1) {
                    throw ApiException.badRequest("这个文件不是有效的图片。");
                }
                if ((long) image.getWidth() * image.getHeight() > 40_000_000L) {
                    throw ApiException.badRequest("图片尺寸过大，请压缩后再上传。");
                }
            }

            Path dir = Path.of(properties.uploadDirOrDefault()).toAbsolutePath().normalize();
            Files.createDirectories(dir);
            String name = UUID.randomUUID().toString().replace("-", "") + extension;
            Path target = dir.resolve(name);
            Files.copy(new ByteArrayInputStream(bytes), target, StandardCopyOption.REPLACE_EXISTING);

            String base = properties.publicBaseUrl() == null ? "" : properties.publicBaseUrl().trim();
            if (base.endsWith("/")) {
                base = base.substring(0, base.length() - 1);
            }
            return new UploadResult(base + "/uploads/" + name);
        } catch (IOException ex) {
            throw new ApiException(500, "图片保存失败，请稍后再试。");
        }
    }
}
