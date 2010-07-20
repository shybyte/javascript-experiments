package marco.stahl.dinoid.client.view;

import marco.stahl.dinoid.client.model.Gem;
import marco.stahl.dinoid.client.model.GemField;
import marco.stahl.dinoid.client.model.Vec2Int;
import marco.stahl.dinoid.client.model.GemField.GemFunction;
import marco.stahl.dinoid.client.util.Array2D;
import marco.stahl.dinoid.client.util.WidgetUtil;

import com.google.gwt.user.client.ui.AbsolutePanel;
import com.google.gwt.user.client.ui.Composite;
import com.google.gwt.user.client.ui.Image;

public class GemFieldView extends Composite {

	private final GemField gemField;
	private AbsolutePanel panel;
	private final int blockSize;
	private Array2D<Image> images;

	public GemFieldView(int blockSize, GemField gemField) {
		this.blockSize = blockSize;
		this.gemField = gemField;
		images = Array2D.create(gemField.getDimension());
		panel = new AbsolutePanel();
		initWidget(panel);
		paint();
		setSize(getWidth(), getHeight());
	}

	private void setSize(int width, int height) {
		setSize(WidgetUtil.asPixelString(width), WidgetUtil
				.asPixelString(height));
	}

	private int getPixelSize(int blocks) {
		return blocks * blockSize;
	}

	private void paint() {
		panel.clear();
		gemField.forAllGemes(new GemFunction() {
			@Override
			public void forGem(int x, int y, Gem gem) {
				addGemImage(x, y, gem);
			}
		});
	}

	private String getGemImageFilename(Gem gem) {
		return "images/gem_" + gem.name().toLowerCase() + "_32.png";
	}

	private void addGemImage(int x, int y, Gem gem) {
		if (gem != Gem.EMPTY) {
			Image img = new Image(getGemImageFilename(gem));
			panel.add(img);
			panel.setWidgetPosition(img, x * blockSize, y * blockSize);
			images.set(x, y, img);
		}
	}

	public int getWidth() {
		return getPixelSize(gemField.getDimension().width);
	}

	public int getHeight() {
		return getPixelSize(gemField.getDimension().height);
	}

	public int getPosY() {
		return getPixelSize(gemField.getPosY());
	}

	private int getPixelSize(double posY) {
		return (int) (((double) blockSize) * posY);
	}

	public void refresh() {
		for (Vec2Int changedGem : gemField.getChangedGems()) {
			int x = changedGem.x;
			int y = changedGem.y;
			String newImageFileName = getGemImageFilename(gemField.getGem(x, y));
			images.get(x, y).setUrl(newImageFileName);
		}
	}
}
