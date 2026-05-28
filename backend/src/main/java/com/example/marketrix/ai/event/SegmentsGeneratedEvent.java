package com.example.marketrix.ai.event;

import lombok.AllArgsConstructor;
import lombok.Getter;

import java.util.UUID;

@Getter
@AllArgsConstructor
public class SegmentsGeneratedEvent {

    private final UUID requirementId;
}
