package marco.stahl.dinoid.client.util;

public class RandomIntGeneratorImpl implements RandomIntGenerator {

	@Override
	public int getInt(int limit) {		
		return (int) (Math.random()*limit);
	}

}
