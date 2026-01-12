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
	app *application.App

	ctx context.Context
	log *slog.Logger
	cli *APIClient
	bus ro.Subject[events.Message]
	tws *PtySrv
}

// NewApp creates a new App application struct
func NewApp(app *application.App) *App {
	return &App{
		app: app,
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
		a.log.Debug(fmt.Sprintf("message: %+v", msg))
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

// Greet returns a greeting for the given name
func (a *App) Greet(name string) *events.Message {
	a.log.Info(fmt.Sprintf("Hello %s, It's show time!", name))
	return nil
}
