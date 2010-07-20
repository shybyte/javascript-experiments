package marco.stahl.dinoid.client.model;

import java.util.Collection;
import java.util.List;

import marco.stahl.dinoid.client.util.CollectionUtils;

public class CollisionsDetector {

	public Collection<Collision> detectCollisions(GemField gemField,
			Collection<Shot> shots) {
		List<Collision> collosions = CollectionUtils.newArrayList();
		for (Shot shot : shots) {
			Collision collosion = detectCollision(gemField, shot);
			if (collosion != null) {
				collosions.add(collosion);
			}
		}
		return collosions;
	}

	private Collision detectCollision(GemField gemField, Shot shot) {
		int shotX = (int) shot.getX();
		int shotY = (int) (shot.getY() - gemField.posY);
		int minY = Math.max(shotY, 0);
		for (int y = gemField.getDimension().height - 1; y >= minY; y--) {
			if (gemField.getGem(shotX, y) != Gem.EMPTY) {
				return new Collision(shot, shotX, y);
			}
		}
		return null;
	}
}
