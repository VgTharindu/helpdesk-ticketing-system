<?php

namespace App\Enums;

enum AssignmentType: string
{
    case Claim = 'claim';
    case Assigned = 'assigned';
    case Reassigned = 'reassigned';
}
