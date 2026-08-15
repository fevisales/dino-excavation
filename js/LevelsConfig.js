export const GAME_LEVELS = [
    {
        level: 1,
        dinosaur: "t_rex",
        dinoImage: "assets/images/t-rex.svg",
        grid: { rows: 2, cols: 2 },
        bonesCount: 2,
        boneImages: [
            'assets/images/t-rex-1.svg',
            'assets/images/t-rex-2.svg'
        ],
        maxShovels: 6,
        timeLimit: 60 // 1 minute
    },
    {
        level: 2,
        dinosaur: "triceratops",
        dinoImage: "assets/images/triceratops.svg",
        grid: { rows: 3, cols: 3 },
        bonesCount: 3,
        boneImages: [
            'assets/images/triceratops-1.svg',
            'assets/images/triceratops-2.svg',
            'assets/images/triceratops-3.svg'
        ],
        maxShovels: 8,
        timeLimit: 75
    },
    {
        level: 3,
        dinosaur: "velociraptor",
        dinoImage: "assets/images/velociraptor.svg",
        grid: { rows: 4, cols: 4 },
        bonesCount: 4,
        boneImages: [
            'assets/images/velociraptor_bone_1.svg',
            'assets/images/velociraptor_bone_2.svg',
            'assets/images/velociraptor_bone_3.svg',
            'assets/images/velociraptor_bone_4.svg'
        ],
        maxShovels: 10,
        timeLimit: 90
    },
    {
        level: 4,
        dinosaur: "stegosaurus",
        dinoImage: "assets/images/stegosaurus.svg",
        grid: { rows: 5, cols: 5 },
        bonesCount: 5,
        boneImages: [
            'assets/images/stegosaurus_bone_1.svg',
            'assets/images/stegosaurus_bone_2.svg',
            'assets/images/stegosaurus_bone_3.svg',
            'assets/images/stegosaurus_bone_4.svg',
            'assets/images/stegosaurus_bone_5.svg'
        ],
        maxShovels: 12,
        timeLimit: 105
    },
    {
        level: 5,
        dinosaur: "brachiosaurus",
        dinoImage: "assets/images/brachiosaurus.svg",
        grid: { rows: 5, cols: 5 },
        bonesCount: 6,
        boneImages: [
            'assets/images/brachiosaurus_bone_1.svg',
            'assets/images/brachiosaurus_bone_2.svg',
            'assets/images/brachiosaurus_bone_3.svg',
            'assets/images/brachiosaurus_bone_4.svg',
            'assets/images/brachiosaurus_bone_5.svg',
            'assets/images/brachiosaurus_bone_6.svg'
        ],
        maxShovels: 16,
        timeLimit: 120
    },
    {
        level: 6,
        dinosaur: "pterodactyl",
        dinoImage: "assets/images/pterodactyl.svg",
        grid: { rows: 5, cols: 5 },
        bonesCount: 7,
        boneImages: [
            'assets/images/pterodactyl_bone_1.svg',
            'assets/images/pterodactyl_bone_2.svg',
            'assets/images/pterodactyl_bone_3.svg',
            'assets/images/pterodactyl_bone_4.svg',
            'assets/images/pterodactyl_bone_5.svg',
            'assets/images/pterodactyl_bone_6.svg',
            'assets/images/pterodactyl_bone_7.svg'
        ],
        maxShovels: 18,
        timeLimit: 120
    },
    {
        level: 7,
        dinosaur: "ankylosaurus",
        dinoImage: "assets/images/ankylosaurus.svg",
        grid: { rows: 5, cols: 5 },
        bonesCount: 8,
        boneImages: [
            'assets/images/ankylosaurus_bone_1.svg',
            'assets/images/ankylosaurus_bone_2.svg',
            'assets/images/ankylosaurus_bone_3.svg',
            'assets/images/ankylosaurus_bone_4.svg',
            'assets/images/ankylosaurus_bone_5.svg',
            'assets/images/ankylosaurus_bone_6.svg',
            'assets/images/ankylosaurus_bone_7.svg',
            'assets/images/ankylosaurus_bone_8.svg'
        ],
        maxShovels: 20,
        timeLimit: 120
    }
];