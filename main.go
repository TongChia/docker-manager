package main

import (
	"embed"
	"log/slog"

	"github.com/wailsapp/wails/v3/pkg/application"
)

//go:embed all:frontend/dist
var assets embed.FS

func main() {
	// Create an instance of the app structure

	app := application.New(application.Options{
		Name: "Docker Manager",
		Assets: application.AssetOptions{
			Handler: application.AssetFileServerFS(assets),
		},
		Mac: application.MacOptions{
			ApplicationShouldTerminateAfterLastWindowClosed: true,
		},
		LogLevel: slog.LevelDebug,
	})

	app.Window.NewWithOptions(application.WebviewWindowOptions{
		Title:     "Docker Manager",
		Width:     1024,
		Height:    768,
		MinWidth:  768,
		MinHeight: 384,

		BackgroundType: application.BackgroundTypeTransparent,
		//BackgroundColour: application.NewRGBA(27, 38, 54, 1),
		BackgroundColour: application.NewRGBA(27, 38, 54, 0),
		Mac: application.MacWindow{
			Backdrop: application.MacBackdropTranslucent,
			TitleBar: application.MacTitleBarHiddenInset,
		},
		Linux: application.LinuxWindow{
			WindowIsTranslucent: true,
		},
	})

	app.RegisterService(application.NewService(NewApp(app)))
	app.RegisterService(application.NewService(NewTerm(app)))

	err := app.Run()
	if err != nil {
		panic(err)
	}

	// Create application with options
	//err := application.Run(&options.App{
	//	Title:     "docker-manager",
	//	Width:     1024,
	//	Height:    768,
	//	MinWidth:  768,
	//	MinHeight: 384,
	//	AssetServer: &assetserver.Options{
	//		Assets: assets,
	//	},
	//	BackgroundColour: &options.RGBA{R: 27, G: 38, B: 54, A: 1},
	//
	//	Mac: &mac.Options{
	//		TitleBar: mac.TitleBarHiddenInset(),
	//		About: &mac.AboutInfo{
	//			Title:   "Docker Manager",
	//			Message: "<tongchia@live.com>",
	//			Icon:    nil,
	//		},
	//		WebviewIsTransparent: true,
	//		WindowIsTranslucent:  true,
	//	},
	//
	//	Windows: &windows.Options{
	//		WebviewIsTransparent: true,
	//		WindowIsTranslucent:  true,
	//	},
	//
	//	OnStartup:  app.startup,
	//	OnShutdown: app.shutdown,
	//	Bind: []interface{}{
	//		app,
	//	},
	//})

	//if err != nil {
	//	println("Error:", err.Error())
	//}
}
