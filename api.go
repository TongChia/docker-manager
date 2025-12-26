package main

import (
	"context"

	"github.com/moby/moby/api/types/events"
	"github.com/moby/moby/client"
	"github.com/samber/ro"
)

type APIClient struct {
	client.APIClient
	EventsOba ro.Observable[events.Message]
	Close     func() error
}

func NewAPIClient(ctx context.Context, opt ...client.Opt) (*APIClient, error) {
	cli, err := client.New(opt...)
	if err != nil {
		return nil, err
	}

	ctx, cancel := context.WithCancel(ctx)
	eventsResult := cli.Events(ctx, client.EventsListOptions{})
	oba := ro.NewObservable(func(obs ro.Observer[events.Message]) ro.Teardown {
		go func() {
			for {
				select {
				case err := <-eventsResult.Err:
					obs.Error(err)
					return
				default:
					msg, ok := <-eventsResult.Messages
					if ok {
						obs.Next(msg)
					} else {
						obs.Complete()
					}
				}
			}
		}()
		return nil
	})
	clz := func() error {
		cancel()
		return cli.Close()
	}
	return &APIClient{cli, oba, clz}, nil
}

// TODO: 优化
func (a *App) connectApiClient(opt ...client.Opt) (err error) {
	if a.cli != nil {
		_ = a.cli.Close()
	}
	a.cli, err = NewAPIClient(a.ctx, opt...)
	if err != nil {
		return err
	}
	a.cli.EventsOba.Subscribe(a.bus)
	return nil
}
