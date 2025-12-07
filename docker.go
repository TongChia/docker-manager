package main

import (
	"context"

	"github.com/moby/moby/api/types/container"
	"github.com/moby/moby/api/types/image"
	"github.com/moby/moby/api/types/volume"
	"github.com/moby/moby/client"
	"github.com/wailsapp/wails/v2/pkg/logger"
)

type Client = *client.Client

func NewClient() Client {
	cli, err := client.New()
	if err != nil {
		panic(err)
	}
	return cli
}

type DockerApp struct {
	ctx context.Context
	log logger.Logger
	api *client.Client
}

type Summary = container.Summary

// NewDockerApp creates a new DockerApp application struct
func NewDockerApp() *DockerApp {
	apiClient, err := client.New()
	if err != nil {
		panic(err)
	}

	return &DockerApp{
		ctx: context.TODO(),
		log: logger.NewDefaultLogger(),
		api: apiClient,
	}
}

func (a *DockerApp) ListContainers() ([]Summary, error) {
	containers, err := a.api.ContainerList(a.ctx, client.ContainerListOptions{All: true})
	if err != nil {
		a.log.Error("Failed to list containers: " + err.Error())
		return nil, err
	}

	//a.log.Info(fmt.Sprintf("Successfully listed containers: %+v", containers.Items))
	return containers.Items, nil
}

func (a *DockerApp) ListVolumes() ([]volume.Volume, error) {
	volumes, err := a.api.VolumeList(a.ctx, client.VolumeListOptions{})
	if err != nil {
		a.log.Error("Failed to list volumes: " + err.Error())
		return nil, err
	}

	return volumes.Items, nil
}

func (a *DockerApp) ListImages() ([]image.Summary, error) {
	images, err := a.api.ImageList(a.ctx, client.ImageListOptions{All: true})
	if err != nil {
		a.log.Error("Failed to list images: " + err.Error())
		return nil, err
	}
	return images.Items, nil
}
