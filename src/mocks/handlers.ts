import { rest } from 'msw'

let goals: { id: number, content: string }[] = [
    {
        id: 1,
        content: "하루 10시간 자기"
    },
    {
        id: 2,
        content: "소고기 먹기"
    },
    {
        id: 3,
        content: "딸기 케이크 5조각 먹기"
    },
    {
        id: 4,
        content: "아이스크림 하루종일 먹기"
    },
    {
        id: 5,
        content: "뛰어놀기"
    },
    {
        id: 6,
        content: "방방 타기"
    },
    {
        id: 7,
        content: "크리스마스에 루돌푸 만나서 악수하기"
    },
    {
        id: 8,
        content: "아이폰 23 Pro Max 사기"
    },
    {
        id: 9,
        content: "Next.js 창시자 만나기"
    },
    {
        id: 10,
        content: "식기건조기 사기"
    },
]

export const handlers = [
    rest.get('https://next-todo.com/goals', (req, res, ctx) => {
        return res(
            ctx.status(200),
            ctx.json(goals)
        )
    }),
    rest.get('https://next-todo.com/goals/:goalId', (req, res, ctx) => {
        const { goalId } = req.params;

        if (typeof goalId !== "string") {
            return res(
                ctx.status(501),
                ctx.json({
                    errorMessage: '다수의 목표를 호출할 수 없습니다',
                }),
            )
        }

        const result = goals.find(goal => goal.id === parseInt(goalId));

        if (!result) return res(
            ctx.status(501),
            ctx.json({
                errorMessage: '해당되는 목표가 없습니다',
            }),
        )

        return res(
            ctx.status(200),
            ctx.json(result)
        )
    }),
    rest.post('https://next-todo.com/goals', (req, res, ctx) => {
        req.json().then(({ content }: { content: string }) => {
            if (content === "") return res(ctx.status(501),
                ctx.json({
                    errorMessage: '목표를 입력해 주세요',
                }),)

            goals.push({
                id: goals.length + 1,
                content,
            })

            return res(ctx.status(200))
        });
    }),
    rest.delete('https://next-todo.com/goals/:goalId', (req, res, ctx) => {
        const { goalId } = req.params;

        if (typeof goalId !== "string") {
            return res(
                ctx.status(501),
                ctx.json({
                    errorMessage: '다수의 목표를 삭제할 수 없습니다',
                }),
            )
        }

        const result = goals.find(goal => goal.id === parseInt(goalId));

        if (!result) return res(
            ctx.status(501),
            ctx.json({
                errorMessage: '해당되는 목표가 없습니다',
            }),
        )

        goals = [...goals.filter(goal => goal.id !== parseInt(goalId))];

        return res(ctx.status(200))
    }),
    rest.put('https://next-todo.com/goals/:goalId', (req, res, ctx) => {
        const { goalId } = req.params;

        if (typeof goalId !== "string") {
            return res(
                ctx.status(501),
                ctx.json({
                    errorMessage: '다수의 목표를 수정할 수 없습니다',
                }),
            )
        }

        req.json().then(({ content }: { content: string }) => {
            if (content === "") return res(ctx.status(501),
                ctx.json({
                    errorMessage: '목표를 입력해 주세요',
                }),)

            const result = goals.find(goal => goal.id === parseInt(goalId));

            if (!result) return res(
                ctx.status(501),
                ctx.json({
                    errorMessage: '해당되는 목표가 없습니다',
                }),
            )

            goals = [...goals, {
                id: result.id,
                content,
            }]

            return ctx.status(200)
        });


        return res(
            ctx.status(200),
        )
    }),
]