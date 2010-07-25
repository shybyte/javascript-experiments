package marco.stahl.dinoid.client.model;

public enum Gem {
	EMPTY, RED, GREEN, BLUE;

	static Gem nextGem(Gem gem) {
		switch (gem) {
		case GREEN:
			return BLUE;
		case BLUE:
			return RED;
		case RED:
			return GREEN;
		default:
			throw new IllegalArgumentException("Don't know gem " + gem);
		}
	}
	
	static Gem prevGem(Gem gem) {
		switch (gem) {
		case GREEN:
			return RED;
		case BLUE:
			return GREEN;
		case RED:
			return BLUE;
		default:
			throw new IllegalArgumentException("Don't know gem " + gem);
		}
	}

	public static Gem randomColorGem() {
		return getColorGem((int) (Math.random() * 3));
	}

	public static Gem getColorGem(int num) {
		return values()[1 + num];
	}
}
