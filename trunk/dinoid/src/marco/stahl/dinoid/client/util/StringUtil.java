package marco.stahl.dinoid.client.util;

public class StringUtil {
	public static final String ensureNotEmpty(String s, String defaultString) {
		return isEmtpty(s) ? defaultString : s;
	}

	private static boolean isEmtpty(String s) {
		return s == null || s.trim().length() == 0;
	}
}
