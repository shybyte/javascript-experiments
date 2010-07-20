package marco.stahl.dinoid.client.util.util2d;

import java.util.List;

import marco.stahl.dinoid.client.util.CollectionUtils;


public class Array2D<T> {
	private List<List<T>> array;
	
	public Array2D(int width,int height) {
		array = CollectionUtils.newArrayList();
		for (int y = 0; y < height; y++) {
			array.add(createHorizonzalArray(width));
		}
	}

	private List<T> createHorizonzalArray(int width) {
		List<T> result = CollectionUtils.newArrayList();
		for (int x = 0; x < width; x++) {
			result.add(null);
		}
		return result;
	}
	
	public static <T> Array2D<T> create(int width,int height){
		return new Array2D<T>(width, height);
	}
	
	public void set(int x,int y,T value) {
		array.get(y).set(x, value);
	}
	
	public T get(int x,int y) {
		return array.get(y).get(x);
	}

	public static <T> Array2D<T> create(Dimension dimension) {
		return create(dimension.width, dimension.height);
	}
	
}
