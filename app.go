package main

import (
	"context"
	"fmt"

	"github.com/moby/moby/api/types/events"
	"github.com/samber/ro"
	"github.com/wailsapp/wails/v2/pkg/logger"
	"github.com/wailsapp/wails/v2/pkg/runtime"
)

// App struct
type App struct {
	ctx context.Context
	log logger.Logger
	cli *APIClient
	bus ro.Subject[events.Message]
}

// NewApp creates a new App application struct
func NewApp() *App {
	return &App{
		log: logger.NewDefaultLogger(),
		bus: ro.NewPublishSubject[events.Message](),
	}
}

// startup is called when the app starts. The context is saved
// so we can call the runtime methods
func (a *App) startup(ctx context.Context) {
	a.ctx = ctx
	_ = a.connectApiClient()
	a.bus.SubscribeWithContext(ctx, ro.OnNext(func(msg events.Message) {
		a.log.Trace(fmt.Sprintf("message: %+v", msg))
		runtime.EventsEmit(ctx, fmt.Sprintf("message:%s", msg.Type), msg)
	}))
	a.log.Info("App startup!")
}

func (a *App) shutdown(ctx context.Context) {
	_ = a.cli.Close()
	a.bus.Complete()
}

// Greet returns a greeting for the given name
func (a *App) Greet(name string) *events.Message {
	a.log.Info(fmt.Sprintf("Hello %s, It's show time!", name))
	return nil
}
