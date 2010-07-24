package marco.stahl.dinoid.client.model;

public class GemFieldSerializer {

	protected static Gem gemFromChar(char c) {
		switch (c) {
		case 'r':
			return Gem.RED;
		case 'g':
			return Gem.GREEN;
		case 'b':
			return Gem.BLUE;
		default:
			return Gem.EMPTY;
		}
	}

	protected static char charFromGem(Gem gem) {
		switch (gem) {
		case RED:
			return 'r';
		case GREEN:
			return 'g';
		case BLUE:
			return 'b';
		default:
			return ' ';
		}
	}

}
