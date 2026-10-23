CREATE TABLE users (
  id BIGINT NOT NULL AUTO_INCREMENT,
  name VARCHAR(40) NOT NULL,
  email VARCHAR(190) NOT NULL,
  password_hash VARCHAR(100) NOT NULL,
  bio VARCHAR(255) NOT NULL DEFAULT '',
  avatar_color VARCHAR(16) NOT NULL DEFAULT '#B36A3C',
  avatar_url VARCHAR(500) NULL,
  verified TINYINT(1) NOT NULL DEFAULT 0,
  created_at DATETIME(3) NOT NULL,
  PRIMARY KEY (id),
  UNIQUE KEY uk_users_email (email)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE recipes (
  id BIGINT NOT NULL AUTO_INCREMENT,
  author_id BIGINT NOT NULL,
  title VARCHAR(60) NOT NULL,
  emoji VARCHAR(16) NOT NULL DEFAULT '🍳',
  category VARCHAR(20) NOT NULL,
  description VARCHAR(320) NOT NULL,
  cook_time INT NOT NULL DEFAULT 30,
  difficulty VARCHAR(10) NOT NULL DEFAULT '简单',
  servings INT NOT NULL DEFAULT 2,
  tip VARCHAR(400) NOT NULL DEFAULT '',
  cover_url VARCHAR(500) NULL,
  crowd INT NOT NULL DEFAULT 0,
  source VARCHAR(16) NOT NULL DEFAULT 'user',
  created_at DATETIME(3) NOT NULL,
  PRIMARY KEY (id),
  KEY idx_recipes_author (author_id),
  KEY idx_recipes_category (category),
  KEY idx_recipes_created (created_at),
  CONSTRAINT fk_recipes_author FOREIGN KEY (author_id) REFERENCES users (id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE ingredients (
  id BIGINT NOT NULL AUTO_INCREMENT,
  recipe_id BIGINT NOT NULL,
  name VARCHAR(60) NOT NULL,
  amount VARCHAR(60) NOT NULL,
  sort_no INT NOT NULL DEFAULT 0,
  PRIMARY KEY (id),
  KEY idx_ingredients_recipe (recipe_id, sort_no),
  CONSTRAINT fk_ingredients_recipe FOREIGN KEY (recipe_id) REFERENCES recipes (id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE recipe_steps (
  id BIGINT NOT NULL AUTO_INCREMENT,
  recipe_id BIGINT NOT NULL,
  content VARCHAR(640) NOT NULL,
  sort_no INT NOT NULL DEFAULT 0,
  PRIMARY KEY (id),
  KEY idx_steps_recipe (recipe_id, sort_no),
  CONSTRAINT fk_steps_recipe FOREIGN KEY (recipe_id) REFERENCES recipes (id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE tags (
  id BIGINT NOT NULL AUTO_INCREMENT,
  name VARCHAR(30) NOT NULL,
  PRIMARY KEY (id),
  UNIQUE KEY uk_tags_name (name)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE recipe_tags (
  recipe_id BIGINT NOT NULL,
  tag_id BIGINT NOT NULL,
  PRIMARY KEY (recipe_id, tag_id),
  KEY idx_recipe_tags_tag (tag_id),
  CONSTRAINT fk_recipe_tags_recipe FOREIGN KEY (recipe_id) REFERENCES recipes (id) ON DELETE CASCADE,
  CONSTRAINT fk_recipe_tags_tag FOREIGN KEY (tag_id) REFERENCES tags (id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE favorites (
  user_id BIGINT NOT NULL,
  recipe_id BIGINT NOT NULL,
  created_at DATETIME(3) NOT NULL,
  PRIMARY KEY (user_id, recipe_id),
  KEY idx_favorites_recipe (recipe_id),
  CONSTRAINT fk_favorites_user FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE,
  CONSTRAINT fk_favorites_recipe FOREIGN KEY (recipe_id) REFERENCES recipes (id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE daily_menus (
  id BIGINT NOT NULL AUTO_INCREMENT,
  owner_key VARCHAR(64) NOT NULL,
  menu_date DATE NOT NULL,
  recipe_ids JSON NOT NULL,
  created_at DATETIME(3) NOT NULL,
  PRIMARY KEY (id),
  UNIQUE KEY uk_daily_menu_owner_date (owner_key, menu_date)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
