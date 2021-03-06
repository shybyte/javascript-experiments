package marco.stahl.dinoid.client.model;

import static org.hamcrest.collection.IsIterableContainingInAnyOrder.*;
import static org.junit.Assert.*;

import java.util.Collection;

import marco.stahl.dinoid.client.util.CollectionUtils;
import marco.stahl.dinoid.client.util.util2d.Dimension;

import org.hamcrest.collection.IsEmptyCollection;
import org.junit.Before;
import org.junit.Test;

public class CollisionsDetectorTest {

	private Dimension gemFieldDimension;
	private GemField gemField = null;
	private CollisionsDetector collosionsDetector = null;
	private Collection<Collision> collosions;
	private Collection<Shot> shots;

	@Before
	public void setUp() throws Exception {
		collosionsDetector = new CollisionsDetector();
		gemFieldDimension = new Dimension(3, 3);
		gemField = new GemField(gemFieldDimension);
	}

	@Test
	public void testShotAboveGem() {
		givenGemFieldAtPosY("" + //
				"r  " + //
				"gg " + //
				"g b", 0);

		Shot middleShot = shot(1, 0);
		givenShots(middleShot);

		collosions = collosionsDetector.detectCollisions(gemField, shots);

		assertThat(collosions, containsInAnyOrder(new Collision(middleShot, 1,
				1)));
	}

	@Test
	public void testShotAboveGemField() {
		givenGemFieldAtPosY("" + //
				"r  " + //
				"g  " + //
				"g b", 0);

		Shot middleShot = shot(1, 0);
		Shot rightShot = shot(2, 0);
		givenShots(middleShot, rightShot);

		collosions = collosionsDetector.detectCollisions(gemField, shots);

		assertThat(collosions,
				containsInAnyOrder(new Collision(rightShot, 2, 2)));
	}

	@Test
	public void testDetectCollisions() {
		givenGemFieldAtPosY("" + //
				"r  " + //
				"gg " + //
				"g b", 0);

		Shot leftShot = shot(0, 2);
		Shot leftShotNoCollision = shot(0, 3);
		Shot middleShot = shot(1, 0);
		givenShots(leftShot, leftShotNoCollision, middleShot);

		collosions = collosionsDetector.detectCollisions(gemField, shots);

		assertThat(collosions, containsInAnyOrder(
				new Collision(leftShot, 0, 2), new Collision(middleShot, 1, 1)));
	}

	@Test
	public void testDetectCollissionsWithPosY() {
		givenGemFieldAtPosY("" + //
				"r  " + //
				"gg " + //
				"g b", -1);

		Shot leftShot = shot(0, 2);
		Shot leftShotNoCollision = shot(0, 4);
		Shot middleShot = shot(1, 0);
		givenShots(leftShot, leftShotNoCollision, middleShot);

		collosions = collosionsDetector.detectCollisions(gemField, shots);

		assertThat(collosions, containsInAnyOrder(new Collision(middleShot, 1,
				1)));
	}

	@Test
	public void testDoNotDetectCollissionsForShotThatLeftScreen() {
		givenGemFieldAtPosY("" + //
				"r  " + //
				"gg " + //
				"g b", -3);

		Shot leftShot = shot(0, -0.01);
		givenShots(leftShot);

		collosions = collosionsDetector.detectCollisions(gemField, shots);

		assertThat(collosions, IsEmptyCollection.<Collision> empty());
	}

	private void givenShots(Shot... givenShots) {
		this.shots = CollectionUtils.newArrayList(givenShots);
	}

	private void givenGemFieldAtPosY(String levelString, double posY) {
		gemField.posY = posY;
		gemField.initFromString(levelString);
	}

	private Shot shot(double x, double y) {
		return new Shot(x, y, -1);
	}

}
