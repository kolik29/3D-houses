var houses = [ //масив со всеми домами на карте
	{
		size: { //размер дома
			x: 10,
			y: 5,
			z: 10
		},
		position: { //положение дома на карте
			x: 15,
			y: 30
		},
		color: 0xff0000, //цвет дома
		roof: { //крыша
			height: 2, //высота крыши
			color: 0x00b2fc //цвет крыши
		}
	},
	{
		size: {
			x: 10,
			y: 5,
			z: 20
		},
		position: {
			x: 15,
			y: -5
		},
		color: 0xFFD900,
		roof: {
			height: 3,
			color: 0x00B945
		}
	},
	{
		size: {
			x: 5,
			y: 5,
			z: 10
		},
		position: {
			x: 40,
			y: 0
		},
		color: 0x25D500,
		roof: {
			height: 3,
			color: 0x9303A7
		}
	}
]

export { houses }