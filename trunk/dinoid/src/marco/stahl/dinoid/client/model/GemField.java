package marco.stahl.dinoid.client.model;

import java.util.Set;

import marco.stahl.dinoid.client.util.CollectionUtils;
import marco.stahl.dinoid.client.util.util2d.Dimension;
import marco.stahl.dinoid.client.util.util2d.Vec2Int;

public class GemField {
	private static final int GROUP_SIZE = 3;
	private static final double SPEED = 0.2;
	private Dimension dimension;
	private Gem[][] gemes;
	double posY;
	private Set<Vec2Int> changedGems;

	public interface GemFunction {
		void forGem(int x, int y, Gem gem);
	}

	public GemField(Dimension dimension) {
		this.dimension = dimension;
		gemes = new Gem[dimension.height][];
		for (int i = 0; i < dimension.height; i++) {
			gemes[i] = new Gem[dimension.width];
			for (int x = 0; x < dimension.width; x++) {
				gemes[i][x]=Gem.EMPTY;
			}
		}
		changedGems = CollectionUtils.newHasSet();
	}

	public void initFromString(final String s) {
		forAllGemes(new GemFunction() {
			@Override
			public void forGem(int x, int y, Gem gem) {
				setGem(x, y, GemFieldSerializer.gemFromChar(s.charAt(y
						* dimension.width + x)));
			}
		});
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

	public void moveToStartPosition() {
		posY = -dimension.height;
	}

	public void move(double timeDelta) {
		posY += timeDelta * SPEED;
	}

	public Dimension getDimension() {
		return dimension;
	}

	public double getPosY() {
		return posY;
	}

	public Gem getGem(int x, int y) {
		return gemes[y][x];
	}

	public void onShootedGem(int x, int y) {
		setGem(x, y, Gem.nextGem(getGem(x, y)));
		changedGems.add(new Vec2Int(x, y));
		disolveGroups(x, y);
	}

	private void disolveGroups(int x, int y) {
		Gem gem = getGem(x, y);
		dissolveHorizontal(x, y, gem);
		dissolveVerticalUpward(x, y, gem);
	}

	private void dissolveHorizontal(int gemX, int gemY, Gem gem) {
		int rightBorder = getRightGroupBorder(gemX, gemY, gem);
		int leftBorder = getLeftGroupBorder(gemX, gemY, gem);
		if (rightBorder - leftBorder > GROUP_SIZE) {
			for (int x = leftBorder + 1; x < rightBorder; x++) {
				removeGem(x, gemY);
			}
		}
	}

	private int getRightGroupBorder(int gemX, int gemY, Gem gem) {
		int x = gemX + 1;
		while (x < dimension.width && getGem(x, gemY) == gem) {
			x++;
		}
		return x;
	}

	private int getLeftGroupBorder(int gemX, int gemY, Gem gem) {
		int x = gemX - 1;
		while (x >= 0 && getGem(x, gemY) == gem) {
			x--;
		}
		return x;
	}

	private void dissolveVerticalUpward(int gemX, int gemY, Gem gem) {
		int topBorder = getTopGroupBorder(gemX, gemY, gem);
		if (gemY - topBorder >= GROUP_SIZE) {
			for (int y = gemY; y > topBorder; y--) {
				removeGem(gemX, y);
			}
		}
	}

	private int getTopGroupBorder(int gemX, int gemY, Gem gem) {
		int y = gemY - 1;
		while (y >= 0 && getGem(gemX, y) == gem) {
			y--;
		}
		return y;
	}

	private void removeGem(int x, int y) {
		setGem(x, y, Gem.EMPTY);
		changedGems.add(new Vec2Int(x, y));
	}

	public Set<Vec2Int> getChangedGems() {
		return changedGems;
	}

	void clearChangedGems() {
		changedGems.clear();
	}

	public String getMapAsString() {
		final StringBuilder sb = new StringBuilder();
		forAllGemes(new GemFunction() {
			@Override
			public void forGem(int x, int y, Gem gem) {
				sb.append(GemFieldSerializer.charFromGem(gem));
			}
		});
		return sb.toString();
	}

	public void printMapAsPrettyString() {
		String mapString = getMapAsString();
		for (int i = 0; i < mapString.length(); i++) {
			System.out.print(mapString.charAt(i));
			if (i % dimension.width == 0 && i > 0) {
				System.out.print("\n");
			}
		}
		System.out.print("\n");
	}

	public double getBottomGemPosY() {
		double maxY = Double.MIN_VALUE;
		for (int x = 0; x < dimension.width; x++) {
			maxY = Math.max(maxY, getBottomGemPoxYForColumn(x));
		}
		return maxY + posY + 1;
	}

	private int getBottomGemPoxYForColumn(int x) {
		int y = dimension.height - 1;
		while (y >= 0 && isEmpty(x, y)) {
			y--;
		}
		return y;
	}

	private boolean isEmpty(int x, int y) {
		return getGem(x, y) == Gem.EMPTY;
	}

}
