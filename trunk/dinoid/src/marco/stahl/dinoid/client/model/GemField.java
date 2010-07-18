package marco.stahl.dinoid.client.model;

public class GemField {
	private static final double SPEED = 0.1;
	private Dimension dimension;
	private Gem[][] gemes;
	private double posY;

	public interface GemFunction {
		void forGem(int x, int y, Gem gem);
	}

	public GemField(Dimension dimension) {
		this.dimension = dimension;
		gemes = new Gem[dimension.height][];
		for (int i = 0; i < dimension.height; i++) {
			gemes[i] = new Gem[dimension.width];
		}
	}

	public void initRandom() {
		forAllGemes(new GemFunction() {
			@Override
			public void forGem(int x, int y, Gem gem) {
				setGem(x, y, randomGem());
			}
		});
	}
	
	public void initFromString(final String s) {
		forAllGemes(new GemFunction() {
			@Override
			public void forGem(int x, int y, Gem gem) {
				setGem(x, y, gemFromChar(s.charAt(y*dimension.width+x)));
			}
		});
	}

	protected Gem gemFromChar(char c) {
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

	public void setGem(int x, int y, Gem gem) {
		gemes[y][x] = gem;
	}

	public void forAllGemes(GemFunction gemFunction) {
		for (int y = 0; y < dimension.height; y++) {
			for (int x = 0; x < dimension.width; x++) {
				gemFunction.forGem(x, y, gemes[y][x]);
			}
		}
	}

	private Gem randomGem() {
		return Gem.values()[(int) (Math.random() * Gem.values().length)];
	}

	public void moveToStartPosition() {
		posY = -dimension.height;
	}
	
	public void move(double timeDelta) {
		posY += timeDelta*SPEED;
	}

	public Dimension getDimension() {
		return dimension;
	}

	public double getPosY() {
		return posY;
	}
}
