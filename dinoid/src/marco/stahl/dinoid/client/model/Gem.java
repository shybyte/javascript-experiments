package marco.stahl.dinoid.client.model;

public enum Gem {
	EMPTY,RED,GREEN,BLUE;

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
}
