'use client'

import { KeyboardEvent, useEffect, useState } from 'react'

const GRID_SIZE = 20

type Point = {
	x: number
	y: number
}

type Direction = 'UP' | 'DOWN' | 'LEFT' | 'RIGHT'

export default function SnakeGrid() {
	const [snake, setSnake] = useState<Point[]>([
		{ y: 0, x: 2 },
		{ y: 0, x: 1 },
		{ y: 0, x: 0 }
	])
	const [food, setFood] = useState<Point>({ x: 0, y: 0 })
	const [direction, setDirection] = useState<Direction>('DOWN')
	const [gameOver, setGameOver] = useState<boolean>(false)
	const generateFood = () => {
		const x = Math.floor(Math.random() * GRID_SIZE)
		const y = Math.floor(Math.random() * GRID_SIZE)
		setFood({ x, y })
	}

	const moveSnake = () => {
		const newSnake = [...snake]
		const snakeHead = { ...newSnake[0] }

		if (direction === 'UP') {
			snakeHead.y -= 1
		}

		if (direction === 'DOWN') {
			snakeHead.y += 1
		}

		if (direction === 'LEFT') {
			snakeHead.x -= 1
		}

		if (direction === 'RIGHT') {
			snakeHead.x += 1
		}
		if (
			snakeHead.x < 0 ||
			snakeHead.x > GRID_SIZE ||
			snakeHead.y < 0 ||
			snakeHead.y > GRID_SIZE ||
			newSnake.some(
				(snakePart) =>
					snakePart.x === snakeHead.x && snakePart.y === snakeHead.y
			)
		) {
			setGameOver(true)
			return
		}

		newSnake.unshift(snakeHead)
		if (snakeHead.x === food.x && snakeHead.y === food.y) {
			generateFood()
		} else {
			newSnake.pop()
		}
		setSnake(newSnake)
	}

	useEffect(() => {
		const interval = setInterval(moveSnake, 60)

		return () => clearInterval(interval)
	}, [snake, direction])

	useEffect(() => {
		generateFood()
	}, [])

	const handleKeyPress = (event: KeyboardEvent<HTMLDivElement>) => {
		console.log(event)
		if (event.key === 'ArrowUp' && direction !== 'DOWN') {
			setDirection('UP')
		}
		if (event.key === 'ArrowDown' && direction !== 'UP') {
			setDirection('DOWN')
		}
		if (event.key === 'ArrowLeft' && direction !== 'RIGHT') {
			setDirection('LEFT')
		}
		if (event.key === 'ArrowRight' && direction !== 'LEFT') {
			setDirection('RIGHT')
		}
	}

	return (
		<div
			tabIndex={0}
			onKeyDown={handleKeyPress}
			className="grid grid-cols-20 grid-rows-20 border border-black"
		>
			{gameOver && (
				<div className="absolute h-screen inset-0 flex justify-center items-center text-4xl font-bold text-red-500">
					Game Over
				</div>
			)}
			{Array.from({ length: GRID_SIZE }).map((_, y) => (
				<div key={y} className="flex">
					{Array.from({ length: GRID_SIZE }).map((_, x) => (
						<div
							key={x}
							className={`w-5 h-5 border border-gray-300
                            ${
								snake.some(
									(snakePart) =>
										snakePart.x === x && snakePart.y === y
								) && 'bg-green-500'
							} ${food.x === x && food.y === y && 'bg-red-500'}
                            `}
						></div>
					))}
				</div>
			))}
		</div>
	)
}
