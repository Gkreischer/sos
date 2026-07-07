<?php

namespace App;

enum UserType: string
{
    case ADMIN = 1;
    case CLIENT = 2;
    case TECHNICIAN = 3;
    case ATTENDANT = 4;
}
