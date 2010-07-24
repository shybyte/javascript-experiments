package marco.stahl.dinoid.client;

import marco.stahl.dinoid.client.pages.GameViewPage;
import marco.stahl.dinoid.client.pages.HiscorePage;
import marco.stahl.dinoid.client.pages.StartPage;
import marco.stahl.dinoid.client.pages.event.GameFinishedEvent;
import marco.stahl.dinoid.client.pages.event.GameFinishedEventHandler;
import marco.stahl.dinoid.client.pages.event.StartGameEvent;
import marco.stahl.dinoid.client.pages.event.StartGameEventHandler;
import marco.stahl.dinoid.client.pages.event.StartPageEvent;
import marco.stahl.dinoid.client.pages.event.StartPageEventHandler;

import com.google.gwt.core.client.EntryPoint;
import com.google.gwt.event.shared.HandlerManager;
import com.google.gwt.user.client.ui.RootPanel;
import com.google.gwt.user.client.ui.Widget;

public class Dinoid implements EntryPoint,GameFinishedEventHandler,StartGameEventHandler,StartPageEventHandler {
	private enum State {
		START_SCREEN,GAME,HISCORE
	}
	
	private State state = State.START_SCREEN;
	private HandlerManager eventBus;

	public void onModuleLoad() {
		eventBus = new HandlerManager(null);
		addHandler();
		changeState(State.START_SCREEN);
	}

	private void addHandler() {
		eventBus.addHandler(GameFinishedEvent.TYPE, this);
		eventBus.addHandler(StartGameEvent.TYPE, this);
		eventBus.addHandler(StartPageEvent.TYPE, this);
	}
	
	private void showPageForCurrentState() {
		setPage(getPageForCurrentState());
	}

	private Widget getPageForCurrentState() {
		switch (state) {
		case START_SCREEN:	
			return new StartPage(eventBus);
		case GAME:	
			return new GameViewPage(eventBus);		
		case HISCORE:	
			return new HiscorePage(eventBus);				
		default:
			throw new IllegalStateException("Don't know state "+state);
		}
	}

	private void setPage(Widget page) {
		RootPanel.get("app").clear();
		RootPanel.get("app").add(page);
	}

	private void changeState(State newState) {
		this.state = newState;
		showPageForCurrentState();
	}
	
	@Override
	public void onGameFinished(GameFinishedEvent gameFinishedEvent) {
		changeState(State.HISCORE);
	}

	@Override
	public void onStartGame(StartGameEvent event) {
		changeState(State.GAME);
	}

	@Override
	public void onStartPage(StartPageEvent event) {
		changeState(State.START_SCREEN);
	}
	

}
