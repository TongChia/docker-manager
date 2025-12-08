package main

import (
	"github.com/moby/moby/api/types/container"
	"github.com/moby/moby/client"
)

type Container = container.Summary

func (a *App) ContainerList() ([]Container, error) {
	result, err := a.cli.ContainerList(a.ctx, client.ContainerListOptions{All: true})
	if err != nil {
		a.log.Error(err.Error())
		return nil, err
	}

	return result.Items, nil
}
