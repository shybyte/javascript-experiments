package marco.stahl.dinoid.client.pages.event;


import com.google.gwt.event.shared.EventHandler;

public interface GameFinishedEventHandler extends EventHandler{
	void onGameFinished(GameFinishedEvent gameFinishedEvent);
}
