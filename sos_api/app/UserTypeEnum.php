<?php

namespace App;

enum UserTypeEnum: int
{
    case ADMIN = 1;
    case CLIENT = 2;
    case TECHNICIAN = 3;
    case ATTENDANT = 4;
    case CONTRACT = 5;
}
