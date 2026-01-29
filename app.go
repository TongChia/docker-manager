package main

import (
	"context"
	"fmt"
	"log/slog"

	"github.com/moby/moby/api/types/events"
	"github.com/samber/ro"
	"github.com/wailsapp/wails/v3/pkg/application"
)

// App struct
type App struct {
	app    *application.App
	win    *application.WebviewWindow
	dialog *application.WebviewWindow
	log    *slog.Logger
	cli    *APIClient
	ctx    context.Context
	bus    ro.Subject[events.Message]
}

// NewApp creates a new App application struct
func NewApp(app *application.App, win *application.WebviewWindow) *App {
	return &App{
		app: app,
		win: win,
		log: app.Logger.WithGroup("App"),
		bus: ro.NewPublishSubject[events.Message](),
	}
}

// ServiceStartup is called when the app starts. The context is saved
// so we can call the runtime methods
func (a *App) ServiceStartup(ctx context.Context, options application.ServiceOptions) error {
	a.ctx = ctx
	_ = a.connectApiClient()
	a.bus.SubscribeWithContext(ctx, ro.OnNext(func(msg events.Message) {
		//a.log.Debug(fmt.Sprintf("message: %+v", msg))
		a.app.Event.Emit(fmt.Sprintf("message:%s", msg.Type), msg)
	}))
	a.log.Info("App startup!")
	return nil
}

func (a *App) ServiceShutdown() error {
	_ = a.cli.Close()
	a.bus.Complete()
	a.log.Info("App shutdown!")
	return nil
}

func (a *App) ExportType() *events.Message {
	a.log.Warn("Meaningless!")
	return nil
}
