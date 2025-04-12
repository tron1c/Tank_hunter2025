const gameData = {
    waves: [
        {
            message: "COMMAND CENTER: The border has fallen! Decode enemy coordinates NOW!",
            enemies: 3,
            hints: [
                {
                    encrypted: "Sum of digits: 3+1+4",
                    hint: "The code is 314 (3+1+4=8)",
                    answer: 314,
                    points: 100
                },
                {
                    encrypted: "Digits in order: 1, 2, 3, 4",
                    hint: "Combine these numbers sequentially",
                    answer: 1234,
                    points: 150
                },
                {
                    encrypted: "First digit: 3×1, second: 3×1, third: 4×1, fourth: 6×1",
                    hint: "Multiply each digit by 1 (original numbers)",
                    answer: 3346,
                    points: 200
                }
            ]
        },
        {
            message: "COMMAND CENTER: Enemy reinforcements detected!",
            enemies: 4,
            hints: [
                {
                    encrypted: "Digits: 5, 9, 2, 1 (combine)",
                    hint: "Read the digits in order",
                    answer: 5921,
                    points: 250
                },
                {
                    encrypted: "First half: 8+8, second half: 5+5",
                    hint: "16 and 10 → combine to form 1610",
                    answer: 1610,
                    points: 300
                },
                {
                    encrypted: "First digit: 5, remaining digits: 3×5×2",
                    hint: "5 followed by 30 (3×5×2)",
                    answer: 530,
                    points: 350
                },
                {
                    encrypted: "Year of first moon landing",
                    hint: "Historical event in 1969",
                    answer: 1969,
                    points: 400
                }
            ]
        }
    ],

    story: [
        "October 7, 2042 - 03:47 Hours",
        "The eastern border has collapsed under enemy assault.",
        "Enemy tanks are advancing toward the capital.",
        "All other cryptographers have been captured or killed.",
        "You are our last hope.",
        "Decode their coordinates and direct our artillery fire.",
        "The fate of the nation rests with you."
    ],

    settings: {
        initialLives: 3,
        timePerWave: 60,
        timePenalty: 10,
        revealPenalty: 5
    }
};