package marco.stahl.dinoid.client.model;

import static org.hamcrest.collection.IsIterableContainingInAnyOrder.*;
import static org.junit.Assert.*;
import marco.stahl.dinoid.client.util.util2d.Dimension;
import marco.stahl.dinoid.client.util.util2d.Vec2Int;

import org.junit.Test;

public class GemFieldTest {

	private static final double EQUAL_DOUBLE_DELTA = 0.0001;
	private GemField gemField;

	@Test
	public void testGetMapAsString() {
		String levelString = "" + //
				"r  " + //
				"gg " + //
				"r b";
		givenAGemField(levelString);

		assertEquals(levelString, gemField.getMapAsString());
	}

	@Test
	public void testShootingOnGemChangeColor() {
		givenAGemField("" + //
				"r  " + //
				"gg " + //
				"r b");

		gemField.onShootedGem(1, 1);
		gemField.onShootedGem(0, 2);
		gemField.onShootedGem(2, 2);

		assertGemField("" + //
				"r  " + //
				"gb " + //
				"g r");
	}

	@Test
	public void testDisolvingHorizonal3Group() {
		givenAGemField(5, "" + //
				"rrgbb");

		gemField.onShootedGem(2, 0);

		assertGemField("" + //
				"rr   ");
	}

	@Test
	public void testDisolvingHorizonal5Group() {
		givenAGemField(7, "" + //
				"rbbgbbr");

		gemField.onShootedGem(3, 0);

		assertGemField("" + //
				"r     r");
	}

	@Test
	public void testDisolvingVertical3Group() {
		givenAGemField(1, "" + //
				"r" + //
				"r" + //
				"b");

		gemField.onShootedGem(0, 2);

		assertGemField("" + //
				" " + //
				" " + //
				" ");
	}

	@Test
	public void testDisolvingVertical4Group() {
		givenAGemField(1, "" + //
				"g" + //
				"r" + //
				"r" + //
				"r" + //
				"b");

		gemField.onShootedGem(0, 4);

		assertGemField("" + //
				"g" + //
				" " + //
				" " + //
				" " + //
				" ");
	}

	@Test
	public void testDisolvingVerticalAndHorizonal() {
		givenAGemField(3, "" + //
				"gbb" + //
				"gbb" + //
				"rgg");

		gemField.onShootedGem(0, 2);

		assertGemField("" + //
				" bb" + //
				" bb" + //
				"   ");
	}

	@Test
	public void testGetChangedGamesContainsDissolvedGames() {
		givenAGemField(3, "" + //
				"gbb" + //
				"gbb" + //
				"rgg");

		gemField.onShootedGem(0, 2);

		assertGemField("" + //
				" bb" + //
				" bb" + //
				"   ");
		assertThat(gemField.getChangedGems(), containsInAnyOrder(new Vec2Int(0,
				0), new Vec2Int(0, 1), new Vec2Int(0, 2), new Vec2Int(1, 2),
				new Vec2Int(2, 2)));
	}
	
	@Test
	public void testGetBottomGemPosY() {
		
		givenAGemField(3, "" + //
				"gb " + //
				" b " + //
				"   " + //
				"   " + //
				"   ");

		gemField.posY = -1 ;
		
		double lowestGemPosY = gemField.getBottomGemPosY();
		
		assertEquals(1, lowestGemPosY,EQUAL_DOUBLE_DELTA);
		
	}

	public void assertGemField(String expectedGameFieldString) {
		assertEquals(expectedGameFieldString, gemField.getMapAsString());
	}

	private void givenAGemField(String levelString) {
		givenAGemField(3, levelString);
	}

	private void givenAGemField(int width, String levelString) {
		Dimension gemFieldDimension = new Dimension(width, levelString.length()
				/ width);
		gemField = new GemField(gemFieldDimension);
		gemField.initFromString(levelString);
	}
}
