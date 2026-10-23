/* 食光 · 预置数据
 * 菜谱为演示内容，步骤与要点经过整理，实际烹饪请按自家火力调整。
 */
const USERS = [
    {
      id: 'u_official',
      name: '食光编辑部',
      email: 'hello@shiguang.app',
      bio: '认真吃饭，认真生活。每天为你挑一道值得下厨的菜。',
      avatarColor: '#D6532F',
      verified: true,
      source: 'seed',
      joinedAt: '2026-01-08T09:00:00+08:00'
    },
    {
      id: 'u_xiaoman',
      name: '林小满',
      email: 'xiaoman@shiguang.app',
      bio: '下班后也要好好吃饭，一锅出是打工人的浪漫。',
      avatarColor: '#B36A3C',
      verified: false,
      source: 'seed',
      joinedAt: '2026-03-16T20:10:00+08:00'
    },
    {
      id: 'u_aze',
      name: '阿泽',
      email: 'aze@shiguang.app',
      bio: '一个爱吃虾的广东人，冰箱里永远有黄油和蒜。',
      avatarColor: '#456985',
      verified: false,
      source: 'seed',
      joinedAt: '2026-05-02T12:30:00+08:00'
    },
    {
      id: 'u_momo',
      name: 'Momo',
      email: 'momo@shiguang.app',
      bio: '甜品是第二个胃，烤箱是家里最治愈的角落。',
      avatarColor: '#A85A7B',
      verified: false,
      source: 'seed',
      joinedAt: '2026-06-11T15:45:00+08:00'
    },
    {
      id: 'u_laozhou',
      name: '老周',
      email: 'laozhou@shiguang.app',
      bio: '炖锅慢一点，日子慢一点。拿手菜都在砂锅里。',
      avatarColor: '#64744E',
      verified: false,
      source: 'seed',
      joinedAt: '2026-02-20T18:00:00+08:00'
    }
  ];

  const CATEGORIES = [
    { name: '家常菜', emoji: '🍳', tone: ['#F4D6BE', '#D98C5F'] },
    { name: '快手菜', emoji: '⚡', tone: ['#F6E5BD', '#DDAE55'] },
    { name: '素菜', emoji: '🥬', tone: ['#DDE7CC', '#8CA36B'] },
    { name: '汤羹', emoji: '🍲', tone: ['#F2D9CC', '#C57E68'] },
    { name: '主食', emoji: '🍚', tone: ['#EDE0C8', '#BC9A6B'] },
    { name: '甜品', emoji: '🍰', tone: ['#F5DCE2', '#C98CA1'] }
  ];

  const TAGS = [
    '下饭神器', '新手友好', '快手', '低脂', '高蛋白',
    '治愈系', '宴客菜', '一锅出', '一人食', '酸甜',
    '甜品', '烘焙', '下午茶', '素食', '慢炖'
  ];

  const RECIPES = [
    {
      id: 'r_tomato_egg',
      title: '番茄炒蛋',
      emoji: '🍅',
      category: '家常菜',
      description: '番茄熬出沙，蛋液还带着一点嫩，酸甜汤汁拌饭能多吃半碗。',
      authorId: 'u_official',
      time: 15,
      difficulty: '简单',
      servings: 2,
      tags: ['下饭神器', '新手友好', '酸甜'],
      ingredients: [
        { name: '番茄', amount: '2 个（约 400g）' },
        { name: '鸡蛋', amount: '3 个' },
        { name: '小葱', amount: '1 根' },
        { name: '白糖', amount: '1 小勺' },
        { name: '盐', amount: '1/2 小勺' },
        { name: '食用油', amount: '3 大勺' }
      ],
      steps: [
        '番茄顶部划十字，用开水烫 30 秒后去皮，切成小块；小葱切成葱花。',
        '鸡蛋加一小撮盐打散。锅烧热，倒 2 大勺油，油温六成热时倒入蛋液，凝固成大块后盛出。',
        '锅里补 1 大勺油，下番茄中火翻炒 2 分钟，压出汤汁，加白糖和盐。',
        '番茄出沙后倒回鸡蛋，轻轻翻匀，让蛋块裹上汤汁，撒葱花出锅。'
      ],
      tip: '想汤汁多一点，可以在炒番茄时加两勺热水；鸡蛋不要炒老，回锅后翻两下就关火。',
      crowd: 268,
      createdAt: '2026-09-02T10:20:00+08:00'
    },
    {
      id: 'r_cola_wings',
      title: '可乐鸡翅',
      emoji: '🍗',
      category: '家常菜',
      description: '外皮焦香、里面入味，甜咸酱汁挂在鸡翅上，是零失败的下饭菜。',
      authorId: 'u_official',
      time: 30,
      difficulty: '简单',
      servings: 2,
      tags: ['下饭神器', '新手友好', '一锅出'],
      ingredients: [
        { name: '鸡中翅', amount: '10 只' },
        { name: '可乐', amount: '330ml' },
        { name: '生抽', amount: '2 大勺' },
        { name: '老抽', amount: '1 小勺' },
        { name: '姜', amount: '3 片' },
        { name: '料酒', amount: '1 大勺' },
        { name: '盐', amount: '少许' },
        { name: '白芝麻', amount: '少许' }
      ],
      steps: [
        '鸡翅两面各划两刀，冷水下锅，加姜片和料酒，煮开后再煮 2 分钟，捞出冲净沥干。',
        '平底锅少油，中小火把鸡翅两面煎到金黄。',
        '倒入可乐没过鸡翅，加生抽、老抽和少许盐，大火煮开后转中小火焖 15 分钟。',
        '开大火收汁，不断翻动让酱汁均匀裹住鸡翅，撒白芝麻出锅。'
      ],
      tip: '可乐本身很甜，老抽只为上色，盐要少放；收汁时守着锅，糖分容易糊底。',
      crowd: 412,
      createdAt: '2026-09-05T18:40:00+08:00'
    },
    {
      id: 'r_broccoli',
      title: '蒜蓉西兰花',
      emoji: '🥦',
      category: '素菜',
      description: '十分钟上桌的清爽绿意，蒜香扑鼻，西兰花脆嫩不发黄。',
      authorId: 'u_official',
      time: 10,
      difficulty: '简单',
      servings: 2,
      tags: ['快手', '低脂', '新手友好', '素食'],
      ingredients: [
        { name: '西兰花', amount: '1 颗' },
        { name: '大蒜', amount: '4 瓣' },
        { name: '盐', amount: '1/2 小勺' },
        { name: '蚝油', amount: '1 小勺' },
        { name: '食用油', amount: '1 大勺' }
      ],
      steps: [
        '西兰花切小朵，用淡盐水泡 10 分钟，冲净；大蒜切末。',
        '水烧开，加一点盐和几滴油，下西兰花焯 40 秒，捞出沥干。',
        '热锅下油，小火炒香蒜末，倒入西兰花大火翻炒 1 分钟。',
        '加盐和蚝油翻匀，立刻出锅。'
      ],
      tip: '焯水时间不要长，40 秒到 1 分钟足够；焯完不要过冷水太久，否则香味会淡。',
      crowd: 186,
      createdAt: '2026-09-08T12:10:00+08:00'
    },
    {
      id: 'r_mapo_tofu',
      title: '麻婆豆腐',
      emoji: '🌶️',
      category: '家常菜',
      description: '麻辣鲜香烫，豆腐嫩得会抖，一勺浇在米饭上就是满足。',
      authorId: 'u_official',
      time: 20,
      difficulty: '中等',
      servings: 2,
      tags: ['下饭神器', '高蛋白'],
      ingredients: [
        { name: '嫩豆腐', amount: '1 盒 400g' },
        { name: '牛肉末', amount: '80g' },
        { name: '郫县豆瓣酱', amount: '1 大勺' },
        { name: '豆豉', amount: '1 小勺' },
        { name: '蒜末', amount: '2 瓣' },
        { name: '姜末', amount: '1 小勺' },
        { name: '花椒粉', amount: '1/2 小勺' },
        { name: '生抽', amount: '1 大勺' },
        { name: '淀粉', amount: '1 小勺' },
        { name: '小葱', amount: '1 根' }
      ],
      steps: [
        '豆腐切 2cm 方块，放淡盐水里泡 5 分钟；淀粉加 3 大勺水调成水淀粉。',
        '热锅下油，放牛肉末炒散至酥香，加豆瓣酱、豆豉、姜蒜末，小火炒出红油。',
        '加 200ml 热水和生抽煮开，轻轻滑入豆腐，中小火煮 5 分钟。',
        '分两次淋入水淀粉，轻推豆腐让汤汁变浓，撒花椒粉和葱花出锅。'
      ],
      tip: '全程用锅铲背轻推，不要大力翻炒；花椒粉最后撒，麻香才够。',
      crowd: 325,
      createdAt: '2026-09-12T19:05:00+08:00'
    },
    {
      id: 'r_braised_pork',
      title: '红烧肉',
      emoji: '🥩',
      category: '家常菜',
      description: '慢火炖到颤巍巍，肥而不腻，酱色油亮，是值得等的一锅。',
      authorId: 'u_official',
      time: 75,
      difficulty: '进阶',
      servings: 4,
      tags: ['宴客菜', '下饭神器', '慢炖'],
      ingredients: [
        { name: '五花肉', amount: '600g' },
        { name: '冰糖', amount: '25g' },
        { name: '生抽', amount: '3 大勺' },
        { name: '老抽', amount: '1 大勺' },
        { name: '料酒', amount: '2 大勺' },
        { name: '姜', amount: '4 片' },
        { name: '葱', amount: '2 段' },
        { name: '八角', amount: '2 颗' },
        { name: '桂皮', amount: '1 小段' },
        { name: '香叶', amount: '2 片' },
        { name: '热水', amount: '800ml' },
        { name: '盐', amount: '适量' }
      ],
      steps: [
        '五花肉切 3cm 方块，冷水下锅，加姜片和料酒焯水，煮开后撇去浮沫，捞出沥干。',
        '锅里少油，放冰糖小火炒到琥珀色，倒入肉块翻炒上色。',
        '加葱姜、八角、桂皮、香叶炒香，烹入料酒，加生抽、老抽和热水没过肉。',
        '大火煮开后转小火，盖盖炖 50 分钟，中途翻动两次。',
        '开盖加盐调味，转大火收汁到浓稠油亮。'
      ],
      tip: '炒糖色宁浅勿深，发黑会苦；一定要加热水，冷水会让肉收缩变柴。',
      crowd: 508,
      createdAt: '2026-09-18T17:25:00+08:00'
    },
    {
      id: 'r_tomato_beef_soup',
      title: '番茄牛腩汤',
      emoji: '🍲',
      category: '汤羹',
      description: '番茄的酸把牛腩炖得软烂，汤浓而不腻，配面包或米饭都合适。',
      authorId: 'u_official',
      time: 90,
      difficulty: '中等',
      servings: 4,
      tags: ['慢炖', '高蛋白', '治愈系'],
      ingredients: [
        { name: '牛腩', amount: '500g' },
        { name: '番茄', amount: '4 个' },
        { name: '洋葱', amount: '1/2 个' },
        { name: '姜', amount: '3 片' },
        { name: '番茄膏', amount: '1 大勺' },
        { name: '料酒', amount: '1 大勺' },
        { name: '盐', amount: '1 小勺' },
        { name: '白胡椒', amount: '少许' },
        { name: '清水', amount: '1.5L' }
      ],
      steps: [
        '牛腩切块，冷水下锅焯水，撇净浮沫后捞出。',
        '番茄两个切块、两个打成泥；洋葱切丁。',
        '锅中下油，炒香洋葱和姜片，加番茄块炒软，再加番茄泥和番茄膏炒出红油。',
        '放入牛腩，加料酒和清水，大火煮开后转小火炖 70 分钟。',
        '加盐和白胡椒调味，再煮 5 分钟即可。'
      ],
      tip: '番茄分两次用：块状保留口感，泥状让汤更浓；牛腩选带一点筋膜的更香。',
      crowd: 297,
      createdAt: '2026-09-22T11:35:00+08:00'
    },
    {
      id: 'r_steamed_fish',
      title: '清蒸鲈鱼',
      emoji: '🐟',
      category: '家常菜',
      description: '鱼肉嫩到一抿就化，葱姜和热油把鲜味提到最高。',
      authorId: 'u_official',
      time: 25,
      difficulty: '中等',
      servings: 2,
      tags: ['高蛋白', '低脂', '宴客菜'],
      ingredients: [
        { name: '鲈鱼', amount: '1 条 约 600g' },
        { name: '姜', amount: '1 块' },
        { name: '小葱', amount: '4 根' },
        { name: '料酒', amount: '1 大勺' },
        { name: '蒸鱼豉油', amount: '2 大勺' },
        { name: '食用油', amount: '2 大勺' },
        { name: '盐', amount: '少许' }
      ],
      steps: [
        '鲈鱼处理干净，两面划刀，用少许盐和料酒抹匀，腌 10 分钟。',
        '盘底铺姜片和葱段，放上鱼，鱼身再放几片姜。',
        '水开后上锅，大火蒸 8 分钟，关火焖 2 分钟。',
        '倒掉盘中腥水，去掉旧葱姜，铺上新鲜葱丝，淋蒸鱼豉油。',
        '热油烧到冒烟，浇在葱丝上激出香味。'
      ],
      tip: '鱼眼变白凸起、鱼肉刚能离骨就是熟了；蒸太久肉会柴。',
      crowd: 241,
      createdAt: '2026-09-26T18:15:00+08:00'
    },
    {
      id: 'r_scallion_noodles',
      title: '葱油拌面',
      emoji: '🍜',
      category: '主食',
      description: '熬一勺葱油，拌一碗面，简单却能香到心里。',
      authorId: 'u_official',
      time: 15,
      difficulty: '简单',
      servings: 2,
      tags: ['快手', '一人食'],
      ingredients: [
        { name: '细面条', amount: '200g' },
        { name: '小葱', amount: '8 根' },
        { name: '生抽', amount: '2 大勺' },
        { name: '老抽', amount: '1 小勺' },
        { name: '白糖', amount: '1 小勺' },
        { name: '食用油', amount: '4 大勺' },
        { name: '白芝麻', amount: '少许' }
      ],
      steps: [
        '小葱洗净擦干，切成长段，葱白和葱绿分开。',
        '冷油下葱白，小火慢熬 5 分钟，再下葱绿熬到焦黄酥脆，捞出葱段。',
        '关火，趁热加入生抽、老抽和白糖，利用余温搅匀成葱油汁。',
        '面条煮熟捞出，沥干后淋上葱油汁，拌匀，撒葱酥和白芝麻。'
      ],
      tip: '葱一定擦干再下锅，避免溅油；全程小火，葱香才出得来。',
      crowd: 355,
      createdAt: '2026-10-01T08:40:00+08:00'
    },
    {
      id: 'r_mushroom_greens',
      title: '香菇青菜',
      emoji: '🍄',
      category: '素菜',
      description: '香菇的鲜和青菜的甜碰在一起，清淡但绝不寡淡。',
      authorId: 'u_official',
      time: 12,
      difficulty: '简单',
      servings: 2,
      tags: ['快手', '低脂', '素食'],
      ingredients: [
        { name: '上海青', amount: '300g' },
        { name: '鲜香菇', amount: '6 朵' },
        { name: '蒜', amount: '2 瓣' },
        { name: '蚝油', amount: '1 大勺' },
        { name: '盐', amount: '少许' },
        { name: '淀粉', amount: '1 小勺' }
      ],
      steps: [
        '青菜洗净对半切，香菇切厚片，蒜切末；淀粉加 3 大勺水调匀。',
        '水烧开加少许盐和油，青菜焯 20 秒捞出摆盘。',
        '热锅下油，炒香蒜末和香菇，加蚝油和 3 大勺水煮 2 分钟。',
        '淋水淀粉勾薄芡，加盐调味，浇在青菜上。'
      ],
      tip: '青菜焯水时加一点油，颜色会更翠绿；香菇要炒到边缘微焦才香。',
      crowd: 162,
      createdAt: '2026-10-03T12:05:00+08:00'
    },
    {
      id: 'r_tremella_soup',
      title: '银耳莲子羹',
      emoji: '🥣',
      category: '甜品',
      description: '胶质浓稠，甜度温柔，秋冬夜里热一碗最舒服。',
      authorId: 'u_official',
      time: 60,
      difficulty: '简单',
      servings: 4,
      tags: ['甜品', '治愈系', '素食'],
      ingredients: [
        { name: '干银耳', amount: '1 朵' },
        { name: '莲子', amount: '30g' },
        { name: '红枣', amount: '6 颗' },
        { name: '枸杞', amount: '10g' },
        { name: '冰糖', amount: '30g' },
        { name: '清水', amount: '1.5L' }
      ],
      steps: [
        '银耳提前泡发 2 小时，剪掉黄根，撕成小朵；莲子泡 30 分钟。',
        '银耳和莲子加清水，大火煮开后转小火炖 40 分钟。',
        '加红枣和冰糖再炖 15 分钟，期间搅拌两次帮助出胶。',
        '关火前加枸杞，焖 5 分钟。'
      ],
      tip: '银耳撕得越碎越容易出胶；冰糖最后放，太早放会影响出胶。',
      crowd: 213,
      createdAt: '2026-10-05T21:10:00+08:00'
    },
    {
      id: 'r_crispy_tofu',
      title: '焦香豆腐',
      emoji: '🍳',
      category: '素菜',
      description: '外皮金黄焦脆，里面还是嫩豆腐，淋上酱汁就是一道好菜。',
      authorId: 'u_official',
      time: 18,
      difficulty: '简单',
      servings: 2,
      tags: ['快手', '高蛋白', '素食'],
      ingredients: [
        { name: '老豆腐', amount: '1 块 400g' },
        { name: '生抽', amount: '1 大勺' },
        { name: '蚝油', amount: '1 小勺' },
        { name: '白糖', amount: '1/2 小勺' },
        { name: '蒜', amount: '2 瓣' },
        { name: '小葱', amount: '1 根' },
        { name: '淀粉', amount: '2 大勺' }
      ],
      steps: [
        '豆腐切成 1.5cm 厚片，用厨房纸吸干表面水分，两面薄薄拍一层淀粉。',
        '平底锅下油，中火将豆腐两面煎到金黄，盛出。',
        '蒜切末，用生抽、蚝油、白糖和 4 大勺水调成酱汁。',
        '锅里留底油炒香蒜末，倒入酱汁煮浓，放回豆腐裹匀，撒葱花。'
      ],
      tip: '豆腐一定要吸干水，拍薄淀粉是焦壳的关键；煎的时候别频繁翻动。',
      crowd: 194,
      createdAt: '2026-10-08T19:00:00+08:00'
    },
    {
      id: 'r_matcha_souffle',
      title: '抹茶舒芙蕾',
      emoji: '🥞',
      category: '甜品',
      description: '云朵一样轻，抹茶的微苦把甜味收得刚刚好。',
      authorId: 'u_official',
      time: 40,
      difficulty: '进阶',
      servings: 2,
      tags: ['甜品', '烘焙', '下午茶'],
      ingredients: [
        { name: '鸡蛋', amount: '2 个' },
        { name: '低筋面粉', amount: '25g' },
        { name: '抹茶粉', amount: '6g' },
        { name: '牛奶', amount: '30ml' },
        { name: '细砂糖', amount: '30g' },
        { name: '玉米油', amount: '20ml' },
        { name: '柠檬汁', amount: '几滴' }
      ],
      steps: [
        '蛋黄蛋白分离，蛋白冷藏。蛋黄加牛奶、玉米油搅匀，筛入面粉和抹茶粉拌成细腻蛋黄糊。',
        '蛋白加柠檬汁，分三次加糖打发到提起有小弯钩。',
        '取三分之一蛋白霜与蛋黄糊翻拌，再倒回剩余蛋白霜中快速翻拌均匀。',
        '小火预热不粘锅，舀入面糊，盖盖焖 4 分钟，翻面再焖 3 分钟。',
        '出锅撒糖粉，趁热吃。'
      ],
      tip: '翻拌要轻，消泡会让舒芙蕾变扁；锅温保持小火，可以垫一层导热板。',
      crowd: 288,
      createdAt: '2026-10-10T15:20:00+08:00'
    },
    {
      id: 'r_lemon_chicken',
      title: '柠檬香草烤鸡',
      emoji: '🍋',
      category: '家常菜',
      description: '柠檬和迷迭香钻进鸡皮，烤到金黄流汁，端上桌很有仪式感。',
      authorId: 'u_official',
      time: 55,
      difficulty: '中等',
      servings: 4,
      tags: ['宴客菜', '高蛋白'],
      ingredients: [
        { name: '三黄鸡', amount: '1 只 约 1kg' },
        { name: '柠檬', amount: '1 个' },
        { name: '大蒜', amount: '1 整头' },
        { name: '迷迭香', amount: '2 枝' },
        { name: '橄榄油', amount: '2 大勺' },
        { name: '盐', amount: '1 大勺' },
        { name: '黑胡椒', amount: '1 小勺' },
        { name: '土豆', amount: '2 个' },
        { name: '小番茄', amount: '10 颗' }
      ],
      steps: [
        '鸡洗净擦干，用盐和黑胡椒里外抹匀，冷藏腌 2 小时以上。',
        '柠檬切半，一半塞进鸡腹，加入蒜瓣和迷迭香；土豆切块。',
        '鸡身刷橄榄油，和土豆、小番茄一起放入烤盘。',
        '烤箱 200℃ 烤 40 分钟，中途刷一次油，最后 10 分钟调至 220℃ 上色。',
        '取出静置 10 分钟再切，挤上剩余柠檬汁。'
      ],
      tip: '鸡皮要擦干才能烤脆；静置能让肉汁回流，切开不流一盘子水。',
      crowd: 176,
      createdAt: '2026-10-11T18:30:00+08:00'
    },
    {
      id: 'r_tomyum',
      title: '冬阴功海鲜汤',
      emoji: '🦐',
      category: '汤羹',
      description: '酸辣鲜香，香茅和柠檬叶的味道一闻就开胃。',
      authorId: 'u_official',
      time: 35,
      difficulty: '中等',
      servings: 3,
      tags: ['高蛋白', '快手'],
      ingredients: [
        { name: '鲜虾', amount: '10 只' },
        { name: '花蛤', amount: '300g' },
        { name: '草菇', amount: '150g' },
        { name: '香茅', amount: '2 根' },
        { name: '南姜', amount: '4 片' },
        { name: '柠檬叶', amount: '6 片' },
        { name: '小米辣', amount: '3 个' },
        { name: '冬阴功酱', amount: '2 大勺' },
        { name: '鱼露', amount: '2 大勺' },
        { name: '青柠', amount: '1 个' },
        { name: '椰浆', amount: '100ml' }
      ],
      steps: [
        '虾去虾线，花蛤吐沙洗净，草菇对半切。',
        '锅中加清水，放香茅、南姜、柠檬叶和小米辣，煮开 5 分钟出香。',
        '加冬阴功酱搅匀，下草菇和花蛤煮到开口。',
        '放虾煮 2 分钟，加鱼露和椰浆，关火后挤入青柠汁。'
      ],
      tip: '青柠汁要关火后再加，久煮会发苦；花蛤开口后就熟了，别煮太久。',
      crowd: 231,
      createdAt: '2026-10-13T20:00:00+08:00'
    },
    {
      id: 'r_chicken_rice',
      title: '香菇鸡肉焖饭',
      emoji: '🍚',
      category: '主食',
      description: '一锅到底的懒人饭，鸡肉的油香渗进每一粒米。',
      authorId: 'u_xiaoman',
      time: 35,
      difficulty: '简单',
      servings: 2,
      tags: ['一锅出', '下饭神器', '一人食'],
      ingredients: [
        { name: '大米', amount: '2 杯' },
        { name: '鸡腿肉', amount: '2 块' },
        { name: '干香菇', amount: '6 朵' },
        { name: '胡萝卜', amount: '1/2 根' },
        { name: '生抽', amount: '2 大勺' },
        { name: '老抽', amount: '1 小勺' },
        { name: '蚝油', amount: '1 大勺' },
        { name: '姜', amount: '2 片' }
      ],
      steps: [
        '干香菇泡发切丁，泡菇水留着；鸡腿肉切块，用生抽和姜腌 10 分钟。',
        '热锅下油，炒香香菇和胡萝卜，再下鸡肉炒到变色。',
        '大米淘净放入电饭锅，加入香菇水和清水到正常刻度，倒入炒好的料和酱汁。',
        '按下煮饭键，跳闸后焖 10 分钟，拌匀开吃。'
      ],
      tip: '泡菇水是鲜味来源，底部沉淀不要倒进去；水量比平时略少一点，饭粒更分明。',
      crowd: 342,
      createdAt: '2026-10-16T19:20:00+08:00'
    },
    {
      id: 'r_osmanthus_riceball',
      title: '酒酿桂花小圆子',
      emoji: '🍡',
      category: '甜品',
      description: '暖乎乎的一碗甜汤，酒酿微醺，桂花一撒就是秋天。',
      authorId: 'u_xiaoman',
      time: 20,
      difficulty: '简单',
      servings: 2,
      tags: ['甜品', '治愈系', '快手'],
      ingredients: [
        { name: '糯米小圆子', amount: '150g' },
        { name: '酒酿', amount: '200g' },
        { name: '鸡蛋', amount: '1 个' },
        { name: '枸杞', amount: '10 粒' },
        { name: '冰糖', amount: '15g' },
        { name: '干桂花', amount: '少许' }
      ],
      steps: [
        '水烧开，下小圆子煮到浮起，再煮 1 分钟捞出。',
        '另起锅加清水和冰糖，煮开后加入酒酿。',
        '鸡蛋打散，沿锅边淋入形成蛋花，放回小圆子和枸杞。',
        '煮开即关火，撒干桂花。'
      ],
      tip: '酒酿不要久煮，香气会跑掉；小圆子分开煮，汤才清。',
      crowd: 259,
      createdAt: '2026-10-18T21:30:00+08:00'
    },
    {
      id: 'r_pepper_pork',
      title: '青椒肉丝',
      emoji: '🫑',
      category: '家常菜',
      description: '青椒脆、肉丝嫩，十五分钟搞定的经典下饭菜。',
      authorId: 'u_xiaoman',
      time: 15,
      difficulty: '简单',
      servings: 2,
      tags: ['下饭神器', '快手', '新手友好'],
      ingredients: [
        { name: '猪里脊', amount: '200g' },
        { name: '青椒', amount: '3 个' },
        { name: '蒜', amount: '2 瓣' },
        { name: '生抽', amount: '1 大勺' },
        { name: '料酒', amount: '1 小勺' },
        { name: '淀粉', amount: '1 小勺' },
        { name: '盐', amount: '少许' }
      ],
      steps: [
        '里脊切丝，加生抽、料酒、淀粉抓匀，腌 10 分钟。',
        '青椒去籽切丝，蒜切片。',
        '热锅多放一点油，下肉丝快速滑散到变色，盛出。',
        '底油炒香蒜片和青椒，加盐，倒回肉丝大火翻匀出锅。'
      ],
      tip: '肉丝要逆纹切；滑肉时油温别太高，肉才嫩。',
      crowd: 377,
      createdAt: '2026-10-19T18:10:00+08:00'
    },
    {
      id: 'r_garlic_shrimp',
      title: '蒜香黄油虾',
      emoji: '🦐',
      category: '快手菜',
      description: '黄油和蒜香裹住弹牙的虾，配一碗白饭刚刚好。',
      authorId: 'u_aze',
      time: 20,
      difficulty: '简单',
      servings: 2,
      tags: ['高蛋白', '快手', '下饭神器'],
      ingredients: [
        { name: '大虾', amount: '12 只' },
        { name: '大蒜', amount: '5 瓣' },
        { name: '黄油', amount: '25g' },
        { name: '橄榄油', amount: '1 大勺' },
        { name: '盐', amount: '少许' },
        { name: '黑胡椒', amount: '少许' },
        { name: '柠檬', amount: '1/2 个' }
      ],
      steps: [
        '虾去头去壳留尾，开背去虾线，擦干水分，用盐和黑胡椒腌 5 分钟。',
        '蒜切末。平底锅下橄榄油和一半黄油，中火煎虾，两面各 1 分钟。',
        '加剩余黄油和蒜末，小火炒香，让虾裹满蒜香黄油。',
        '撒欧芹，挤柠檬汁，连酱汁一起盛出。'
      ],
      tip: '虾擦干才能煎出焦香；蒜末后放，避免焦苦。',
      crowd: 301,
      createdAt: '2026-10-20T12:40:00+08:00'
    },
    {
      id: 'r_kimchi_fried_rice',
      title: '泡菜炒饭',
      emoji: '🍳',
      category: '快手菜',
      description: '酸辣泡菜把米饭炒得粒粒分明，最后盖一个流心蛋。',
      authorId: 'u_aze',
      time: 12,
      difficulty: '简单',
      servings: 1,
      tags: ['快手', '一人食', '主食'],
      ingredients: [
        { name: '隔夜米饭', amount: '1 碗' },
        { name: '韩式泡菜', amount: '80g' },
        { name: '午餐肉', amount: '50g' },
        { name: '鸡蛋', amount: '1 个' },
        { name: '韩式辣酱', amount: '1 小勺' },
        { name: '生抽', amount: '1 小勺' },
        { name: '香油', amount: '1 小勺' }
      ],
      steps: [
        '泡菜切碎，午餐肉切丁。',
        '热锅下油，炒香泡菜和午餐肉，加辣酱炒匀。',
        '倒入米饭，用锅铲压散，大火翻炒到粒粒分明，淋生抽。',
        '另煎一个溏心蛋盖在饭上，淋香油，撒海苔碎。'
      ],
      tip: '隔夜饭最好；没有的话把新饭摊凉再炒，水分少才不粘。',
      crowd: 284,
      createdAt: '2026-10-20T19:15:00+08:00'
    },
    {
      id: 'r_basque_cheesecake',
      title: '巴斯克芝士蛋糕',
      emoji: '🍰',
      category: '甜品',
      description: '焦黑的外表，流心的内里，芝士浓郁到犯规。',
      authorId: 'u_momo',
      time: 50,
      difficulty: '中等',
      servings: 6,
      tags: ['甜品', '烘焙', '下午茶'],
      ingredients: [
        { name: '奶油奶酪', amount: '250g' },
        { name: '细砂糖', amount: '60g' },
        { name: '鸡蛋', amount: '2 个' },
        { name: '淡奶油', amount: '120ml' },
        { name: '低筋面粉', amount: '8g' },
        { name: '香草精', amount: '几滴' }
      ],
      steps: [
        '奶油奶酪室温软化，加糖搅打顺滑。',
        '分次加入鸡蛋，每次搅匀，再加淡奶油和香草精。',
        '筛入低筋面粉，拌匀后过筛一次，倒入铺好油纸的 6 寸模具。',
        '烤箱 220℃ 烤 25 分钟，表面焦黑、中心仍晃动即可。',
        '放凉后冷藏 4 小时，脱模切块。'
      ],
      tip: '冷藏一夜风味更好；中心轻微晃动是流心的关键，不要烤到全熟。',
      crowd: 456,
      createdAt: '2026-10-17T16:00:00+08:00'
    },
    {
      id: 'r_strawberry_croissant',
      title: '草莓奶油可颂',
      emoji: '🥐',
      category: '甜品',
      description: '酥皮夹着轻盈奶油和酸甜草莓，周末下午的快乐。',
      authorId: 'u_momo',
      time: 15,
      difficulty: '简单',
      servings: 2,
      tags: ['甜品', '下午茶'],
      ingredients: [
        { name: '可颂', amount: '2 个' },
        { name: '淡奶油', amount: '150ml' },
        { name: '细砂糖', amount: '15g' },
        { name: '草莓', amount: '6 颗' },
        { name: '糖粉', amount: '少许' }
      ],
      steps: [
        '淡奶油加糖，打发到纹路清晰、提起有小尖角。',
        '草莓洗净擦干，一半切片，一半切半。',
        '可颂横向切开但不切断，挤入奶油，夹入草莓片。',
        '表面再挤一点奶油，放上草莓，筛糖粉。'
      ],
      tip: '奶油要冷藏后打发；可颂现吃最酥，放久会软。',
      crowd: 198,
      createdAt: '2026-10-19T15:30:00+08:00'
    },
    {
      id: 'r_seafood_congee',
      title: '砂锅海鲜粥',
      emoji: '🥣',
      category: '主食',
      description: '米粒开花，海鲜的甜全煮进粥里，暖胃又满足。',
      authorId: 'u_laozhou',
      time: 45,
      difficulty: '中等',
      servings: 3,
      tags: ['治愈系', '高蛋白', '慢炖'],
      ingredients: [
        { name: '大米', amount: '1 杯' },
        { name: '鲜虾', amount: '8 只' },
        { name: '花蛤', amount: '200g' },
        { name: '鱿鱼', amount: '100g' },
        { name: '姜丝', amount: '1 小把' },
        { name: '小葱', amount: '2 根' },
        { name: '白胡椒', amount: '少许' },
        { name: '盐', amount: '1 小勺' }
      ],
      steps: [
        '大米洗净，加一点油和盐拌匀，浸泡 20 分钟。',
        '砂锅加水烧开，倒入大米，小火煮 25 分钟，期间搅拌防粘底。',
        '虾去虾线，鱿鱼切圈，花蛤吐沙。',
        '粥煮到米粒开花，依次放入花蛤、虾和鱿鱼，煮 3 分钟。',
        '加盐和白胡椒调味，撒姜丝葱花，滴香油。'
      ],
      tip: '海鲜最后放，煮久会老；砂锅离火后还会继续沸腾，关火要早一点。',
      crowd: 312,
      createdAt: '2026-10-15T11:10:00+08:00'
    },
    {
      id: 'r_meicai_pork',
      title: '梅干菜扣肉',
      emoji: '🥩',
      category: '家常菜',
      description: '梅干菜吸饱肉汁，肉片入口即化，是宴客的硬菜。',
      authorId: 'u_laozhou',
      time: 90,
      difficulty: '进阶',
      servings: 4,
      tags: ['宴客菜', '下饭神器', '慢炖'],
      ingredients: [
        { name: '五花肉', amount: '500g' },
        { name: '梅干菜', amount: '80g' },
        { name: '冰糖', amount: '15g' },
        { name: '生抽', amount: '2 大勺' },
        { name: '老抽', amount: '1 大勺' },
        { name: '料酒', amount: '1 大勺' },
        { name: '姜', amount: '3 片' },
        { name: '八角', amount: '1 颗' }
      ],
      steps: [
        '梅干菜提前泡软，反复冲洗去沙，挤干水分。',
        '五花肉整块冷水下锅，加姜和料酒煮 20 分钟，捞出擦干，表面抹老抽。',
        '锅中少油，将肉皮朝下煎到起泡上色，切成厚片。',
        '梅干菜加冰糖、生抽和八角炒香，铺在碗底，肉片皮朝下码好。',
        '上锅蒸 60 分钟，倒扣到盘中。'
      ],
      tip: '煎肉皮时盖锅盖防溅油；蒸得越久越软糯。',
      crowd: 267,
      createdAt: '2026-10-14T17:50:00+08:00'
    },
    {
      id: 'r_soba',
      title: '凉拌荞麦面',
      emoji: '🥗',
      category: '快手菜',
      description: '清爽低负担，酸辣汁一拌，夏天没胃口也能吃一碗。',
      authorId: 'u_xiaoman',
      time: 10,
      difficulty: '简单',
      servings: 1,
      tags: ['快手', '低脂', '一人食'],
      ingredients: [
        { name: '荞麦面', amount: '100g' },
        { name: '黄瓜', amount: '1/2 根' },
        { name: '胡萝卜', amount: '1/3 根' },
        { name: '鸡蛋', amount: '1 个' },
        { name: '生抽', amount: '2 大勺' },
        { name: '香醋', amount: '1 大勺' },
        { name: '香油', amount: '1 小勺' },
        { name: '辣椒油', amount: '1 小勺' }
      ],
      steps: [
        '鸡蛋摊成蛋皮切丝，黄瓜和胡萝卜切丝。',
        '荞麦面煮熟，捞出过凉水，沥干。',
        '生抽、香醋、香油、辣椒油和 2 大勺清水调成料汁。',
        '面条铺底，放上配菜，淋料汁，撒白芝麻拌匀。'
      ],
      tip: '面条过凉水后更筋道；料汁先尝一下咸淡，再拌。',
      crowd: 221,
      createdAt: '2026-10-20T09:30:00+08:00'
    }
  ];

  const seed = {
    version: 1,
    users: USERS,
    recipes: RECIPES,
    categories: CATEGORIES,
    tags: TAGS,
    demoAccount: { email: 'xiaoman@shiguang.app', password: '123456' }
  };
export default seed;
