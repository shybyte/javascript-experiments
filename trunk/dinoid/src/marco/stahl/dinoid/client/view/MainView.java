package marco.stahl.dinoid.client.view;

import java.util.Map;
import java.util.Set;

import marco.stahl.dinoid.client.model.Shot;
import marco.stahl.dinoid.client.model.World;
import marco.stahl.dinoid.client.util.CollectionUtils;
import marco.stahl.dinoid.client.util.WidgetUtil;

import com.google.gwt.event.dom.client.MouseDownEvent;
import com.google.gwt.event.dom.client.MouseDownHandler;
import com.google.gwt.user.client.ui.AbsolutePanel;
import com.google.gwt.user.client.ui.Composite;
import com.google.gwt.user.client.ui.Image;

public class MainView extends Composite implements MouseDownHandler {

	private AbsolutePanel panel;
	private final GemFieldView gemFieldView;
	private final double blockSize;
	private final World world;
	private final Map<Shot, Image> imagesOfShots = CollectionUtils.newHashMap();

	public MainView(World world, GemFieldView gemFieldView, int blockSize) {
		this.world = world;
		this.gemFieldView = gemFieldView;
		this.blockSize = blockSize;
		panel = new AbsolutePanel();
		initWidget(panel);
		panel.add(gemFieldView);
		panel.addStyleName("mainView");
		panel
				.setSize(
						WidgetUtil
								.asPixelString(toViewCoord(world.getViewDimension().width)),
						WidgetUtil
								.asPixelString(toViewCoord(world.getViewDimension().height)));
		addDomHandler(this, MouseDownEvent.getType());
		refresh();
	}

	public void refresh() {
		gemFieldView.refresh();
		panel.setWidgetPosition(gemFieldView, 0, gemFieldView.getPosY());
		removeUnusedShotImages();
		paintShots();
	}

	private void removeUnusedShotImages() {
		Set<Shot> shotsOfImages = CollectionUtils.newHasSet(imagesOfShots.keySet());
		for (Shot shot : shotsOfImages) {
			if (!world.getShots().contains(shot)) {
				panel.remove(imagesOfShots.get(shot));
				imagesOfShots.remove(shot);
			}
		}
	}

	private void paintShots() { 
		for (Shot shot : world.getShots()) {
			Image shotImage = getOrCreateShotImage(shot);
			setImagePositionFromWorldPosition(shotImage, shot.getX(), shot
					.getY()-0.5);
		}
	}

	private Image getOrCreateShotImage(Shot shot) {
		Image shotImage = imagesOfShots.get(shot);
		if (shotImage == null) {
			shotImage = createShotImage();
			panel.add(shotImage);
			imagesOfShots.put(shot, shotImage);
		}
		return shotImage;
	}

	private void setImagePositionFromWorldPosition(Image image, double x,
			double y) {
		panel.setWidgetPosition(image, toViewCoord(x), toViewCoord(y));
	}

	private int toViewCoord(double worldCoord) {
		return (int) (worldCoord * blockSize);
	}
	
	private double toModelCoord(int viewCord) {
		return viewCord / blockSize;
	}

	private Image createShotImage() {
		return new Image("images/ball_32.png");
	}

	private void shot(int mx, int my) {
		world.shot(toModelCoord(mx), toModelCoord(my));
	}

	@Override
	public void onMouseDown(MouseDownEvent event) {
		int mx = event.getNativeEvent().getClientX() - this.getAbsoluteLeft();
		int my = event.getNativeEvent().getClientY() - this.getAbsoluteTop();
		shot(mx, my);
		event.preventDefault();
		event.preventDefault();
	}
}
