package main

import (
	"context"
	"fmt"

	"github.com/moby/moby/client"
	"github.com/wailsapp/wails/v2/pkg/logger"
)

// App struct
type App struct {
	ctx context.Context
	cli client.APIClient
	log logger.Logger
}

// NewApp creates a new App application struct
func NewApp() *App {
	apiClient, err := client.New()
	if err != nil {
		panic(err)
	}
	return &App{
		cli: apiClient,
		log: logger.NewDefaultLogger(),
	}
}

// startup is called when the app starts. The context is saved
// so we can call the runtime methods
func (a *App) startup(ctx context.Context) {
	a.ctx = ctx
}

// Greet returns a greeting for the given name
func (a *App) Greet(name string) string {
	return fmt.Sprintf("Hello %s, It's show time!", name)
}
