package marco.stahl.dinoid.client.model;

import marco.stahl.dinoid.client.util.RandomIntGenerator;
import marco.stahl.dinoid.client.util.util2d.Dimension;

public class GemFieldGenerator {
	private final Dimension dimension;
	private final RandomIntGenerator random;
	private GemField gemField;

	public GemFieldGenerator(Dimension dimension,
			RandomIntGenerator randomIntGenerator) {
		this.dimension = dimension;
		this.random = randomIntGenerator;
		gemField = new GemField(dimension);
	}

	public GemField getGemField() {
		return gemField;
	}

	private Gem getRandomGem() {
		return Gem.getColorGem(random.getInt(3));
	}
	
	boolean addHorizonalRandomizedGroup(int groupSize, int x, int y) {
		addHorizontalGroup(groupSize, x, y);
		randomizeGroup(groupSize, x, y);
		return true;
	}

	private void randomizeGroup(int groupSize, int x, int y) {
		for (int i = 0; i < groupSize * 2 + 1; i++) {
			shotGemReversed(x + random.getInt(groupSize), y);
		}
	}

	private void addHorizontalGroup(int groupSize, int x, int y) {
		Gem groupColor = getRandomGem();
		for (int i = 0; i < groupSize; i++) {
			gemField.setGem(x + i, y, groupColor);
		}
	}

	public void shotGemReversed(int x, int y) {
		gemField.setGem(x, y, Gem.prevGem(gemField.getGem(x, y)));
	}
}
