package main

import (
	"context"
	"errors"
	"fmt"
	"os/exec"
	"time"

	"github.com/moby/moby/api/types/container"
	"github.com/moby/moby/client"
	"github.com/samber/lo"
	"github.com/samber/ro"
	rostdio "github.com/samber/ro/plugins/stdio"
	"github.com/wailsapp/wails/v2/pkg/runtime"
)

// ContainerList 容器列表
func (a *App) ContainerList() ([]container.Summary, error) {
	r, err := a.cli.ContainerList(a.ctx, client.ContainerListOptions{All: true})
	if err != nil {
		a.log.Error(err.Error())
		return nil, err
	}

	return r.Items, nil
}

// ContainerList 容器
func (a *App) ContainerById(Id string) (*container.Summary, error) {
	opt := client.ContainerListOptions{All: true}
	opt.Filters = make(client.Filters).Add("id", Id)
	r, err := a.cli.ContainerList(a.ctx, opt)
	if err != nil {
		a.log.Error(err.Error())
		return nil, err
	}

	return &r.Items[0], nil
}

// ContainerLogs 容器日志
func (a *App) ContainerLogs(containerId string) error {
	eventName := fmt.Sprintf("Logs:%s", containerId)
	ctx, cancel := context.WithCancel(a.ctx)
	logio, err := a.cli.ContainerLogs(a.ctx, containerId, client.ContainerLogsOptions{})
	if err != nil {
		cancel()
		return err
	}

	runtime.EventsOnce(ctx, eventName, func(optionalData ...interface{}) {
		cancel()
	})

	ro.Pipe[[]byte, []string](
		rostdio.NewIOReaderLine(logio),
		ro.Map(func(line []byte) string {
			return string(line)
		}),
		ro.BufferWhen[string, int64](ro.Interval(200*time.Millisecond)),
	).SubscribeWithContext(ctx, ro.OnNext(func(lines []string) {
		runtime.EventsEmit(ctx, eventName, lines)
	}))
	return nil
}

func (a *App) StopContainer(containerIds []string) error {
	_ = lo.Map(containerIds, func(containerId string, i int) error {
		_, err := a.cli.ContainerKill(a.ctx, containerId, client.ContainerKillOptions{})
		return err
	})
	return nil
}

func (a *App) StartContainer(containerIds []string) error {
	errs := lo.Map(containerIds, func(containerId string, i int) error {
		_, err := a.cli.ContainerStart(a.ctx, containerId, client.ContainerStartOptions{})
		return err
	})
	a.log.Trace(fmt.Sprintf("Start containers %v %v", containerIds, errs))
	return errors.Join(errs...)
}

func (a *App) OpenFolder(path string) error {
	// TODO: test Windows / Linux ?
	info := runtime.Environment(a.ctx)
	cmd := &exec.Cmd{}
	if info.Platform == "darwin" {
		cmd = exec.Command("open", path)
	}
	if info.Platform == "windows" {
		cmd = exec.Command("explorer", path)
	}
	err := cmd.Run()
	return err
}
