package marco.stahl.dinoid.client.util;

public class StringUtil {
	public static final String ensureNotEmpty(final String s, final String defaultString) {
		return isEmtpty(s) ? defaultString : s;
	}

	private static boolean isEmtpty(final String s) {
		return s == null || s.trim().length() == 0;
	}
}
