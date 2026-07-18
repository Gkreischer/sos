<?php

namespace App;

enum OrderStatusEnum: int
{
    case PENDING = 1;
    case IN_PROGRESS = 2;
    case FINISHED = 3;
    case DELIVERED = 4;
    case CANCELLED = 5;
}
