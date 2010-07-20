package marco.stahl.dinoid.client.util;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.HashSet;
import java.util.Set;

import marco.stahl.dinoid.client.model.Shot;

public class CollectionUtils {
	public static <E> ArrayList<E> newArrayList() {
		return new ArrayList<E>();
	}
	
	public static <E> ArrayList<E> newArrayList(E... elements) {
		ArrayList<E> newArrayList = newArrayList();
		for (E e : elements) {
			newArrayList.add(e);
		}
		return newArrayList;
	}

	public static <K, V> HashMap<K, V> newHashMap() {
		return new HashMap<K, V>();
	}

	public static <E> HashSet<E> newHasSet() {
		return new HashSet<E>();
	}

	public static <E> HashSet<E>  newHasSet(Set<E> set) {
		HashSet<E> newHasSet = newHasSet();
		newHasSet.addAll(set);
		return newHasSet;
	}
}
