package marco.stahl.dinoid.client.pages;

import marco.stahl.dinoid.client.pages.event.StartGameEvent;

import com.google.gwt.event.dom.client.ClickEvent;
import com.google.gwt.event.dom.client.ClickHandler;
import com.google.gwt.event.shared.HandlerManager;
import com.google.gwt.user.client.ui.Composite;
import com.google.gwt.user.client.ui.Image;

public class StartPage extends Composite {
	private final HandlerManager eventBus;

	public StartPage(HandlerManager eventBus) {
		this.eventBus = eventBus;
		Image logo = new Image("images/dinoid-logo.png");
		initWidget(logo);
		logo.addClickHandler(new ClickHandler() {
			
			@Override
			public void onClick(ClickEvent event) {
				onLogoClicked();
			}

		});
	}
	
	private void onLogoClicked() {
		eventBus.fireEvent(new StartGameEvent());
	}
}
